---
title: Producer APIs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Production APIs can be used to directly run create constructs:

- [`produceBlock`](#produceblock): runs a [Block](../concepts/blocks) production
- [`produceInput`](#produceinput): runs an [Input](../concepts/schema)
- [`producePreset`](#producepreset): runs a [Preset](../concepts/presets) production
- [`produceSchema`](#produceschema): generates [Schema](../concepts/schema) options

Each production API takes in up to two arguments:

1. The construct to be produced
2. An object with properties from the construct's context as well as [System contexts](../runtime/contexts#system-contexts), not including `take`

## `produceBlock`

Given a [Block](../concepts/blocks), creates a [Creation](../runtime/creations) output by running its [`produce()`](../concepts/blocks#production).

`produceBlock` takes in up to two arguments:

1. `block` _(required)_: a Block
2. `settings` _(required)_: at least `options`, as well as any other properties from a [Block Context](../runtime/contexts#block-contexts) other than `take`

For example, given this Block that produces the start of a README.md file, `produceBlock` can run its `produce()` with any provided options:

```ts
import { produceBlock } from "create";

import { schema } from "./schema";

const blockReadme = schema.createBlock({
	produce(options) {
		return {
			files: {
				"README.md": `# ${options.title}`,
			},
		};
	},
});

// { files: { "README.md": `# My App` }}
await produceBlock(blockReadme, { options: { title: "My App" } });
```

### `args` {#produceblock-args}

Any number of [Args](../concepts/blocks#args) defined by the Block.

For example, given this Block with a `prefix` arg, it can be specified in `produceBlock`:

```ts
import { BlockFactory } from "create";

declare const blockFactory: BlockFactory<{ name: string }, { prefix: string }>;

await produceBlock(blockFactory, {
	args: {
		prefix: "The",
	},
	options: {
		name: "My Production",
	},
});
```

### `created` {#produceblock-created}

Any [Creations](../runtime/contexts#created) to simulate having been made from previously-produced Blocks.

### `options` {#produceblock-options}

Any number of options defined by the Block's [Schema](../concepts/schemas).

For example, this Block is run with a `name` option:

```ts
import { BlockFactory } from "create";

declare const blockFactory: BlockFactory<{ name: string }>;

await produceBlock(blockFactory, {
	options: {
		name: "My Production",
	},
});
```

## `produceInput`

Given an [Input](../concepts/inputs), runs its `produce()` with any provided args.

`produceInput` takes in up to two arguments:

1. `input` _(required)_: an Input
2. `settings` _(required)_: at least `options`, as well as any other properties from a [Preset Context](../runtime/contexts#input-contexts) other than `take`

For example, this Input production reads data from an existing `data.json` file on disk:

```ts
import { createInput, produceInput } from "create";

const inputDataJson = createInput({
	async produce({ fs }) {
		return await JSON.parse(await fs.readFile("data.json"));
	},
});

await produceInput(inputDataJson);
```

### `args` {#input-args}

For example, this Input production reads data from a JSON file on disk by path:

```ts
import { createInput } from "create";
import { z } from "zod";

const inputJsonFile = createInput({
	args: {
		path: z.string(),
	},
	async produce({ args, fs }) {
		return await JSON.parse(await fs.readFile(args.path));
	},
});

await produceInput(inputJsonFile, {
	args: "data.json",
});
```

## `producePreset`

Given a [Preset](../concepts/presets), creates a [Creation](../runtime/creations) output by running each of its Blocks [`produce()`](../concepts/blocks#production).

`producePreset` takes in up to two arguments:

1. `preset` _(required)_: a Preset
2. `settings` _(required)_:
   - `options` _(required)_: [Schema](../concepts/schemas) options to run with
   - `optionsAugment` _(optional)_: a function to augment options from the Schema
   - _(optional)_ any other properties from a [Block Context](../runtime/contexts#block-contexts) other than `take`

`producePreset` returns a Promise for the Preset's [`Creation`](../runtime/creations).
Both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations) will be present.

For example, given this Preset that includes the block from [`produceBlock`](#produceblock), `producePreset` can run its `produce()` with any provided options:

```ts
import { producePreset } from "create";

import { blockReadme } from "./blockReadme";
import { schema } from "./schema";

const preset = schema.createPreset({
	blocks: [blockReadme()],
});

// { files: { "README.md": `# My App` }}
await producePreset(preset, { options: { title: "My App" } });
```

### `options` {#preset-options}

Any number of options defined by the Preset's [Schema](../concepts/schemas).

For example, this Preset is run with a `name` option:

```ts
import { Preset, produceBlock } from "create";
import { z } from "zod";

declare const preset: Preset<{ name: z.ZodString }>;

await produceBlock(preset, {
	options: {
		name: "My Production",
	},
});
```

### `optionsAugment`

A function that takes in the explicitly provided options and returns any remaining options.

Preset options are generated through three steps:

1. Any options provided by `producePreset`'s second parameter's `options`
2. Calling the Preset's [Schema](../concepts/schemas)'s `produce` method, if it exists
3. Calling to an optional `optionsAugment` method of `producePreset`'s second parameter

In other words, `optionsAugment` runs _after_ the Preset's [Schema](../concepts/schemas)'s `produce` method, if it exists.
This can be useful to prompt for any options not determined by `produce()`.

For example, this `optionsAugment` uses a Node.js prompt to fill in a `name` option if it isn't provided:

```ts
import { Preset, producePreset } from "create";
import readline from "node:readline/promises";
import { z } from "zod";

declare const preset: Preset<{ name: z.ZodString }>;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

await producePreset(preset, {
	optionsAugment({ options }) {
		return {
			name: options.name ?? (await rl.question("What is your name?")),
		};
	},
});
```

## `produceSchema`

Given a [Schema](../concepts/schemas), creates an options object by running its [`produce()`](../concepts/schemas#production).

`produceSchema` takes in up to two argument:

1. `schema` _(required)_: a Schema
2. `settings` _(optional)_: any properties from a [Schema Context](../runtime/contexts#schema-contexts), except for `take`

For example, given this Schema that declares an optional `value` option that defaults to `"default"`, `produceSchema` can run its `produce()` with any provided options:

```ts
import { createSchema, produceSchema } from "create";
import { z } from "zod";

const schema = createSchema({
	options: {
		value: z.string().optional(),
	},
	produce(options) {
		return {
			value: options.value ?? "default",
		};
	},
});

// { value: "default" }
await produceSchema(schema);

// { value: "override" }
await produceSchema(schema, {
	options: {
		value: "override",
	},
});
```

:::tip
If the Schema does not define a `produce()`, then `settings.options` is returned.
:::

### `options` {#produceschema-options}

Any number of options defined by the Schema.

For example, this Schema is run with a `name` option:

```ts
import { Schema } from "create";
import { z } from "zod";

declare const schema: Schema<{ name: z.ZodString }>;

await produceSchema(schema, {
	options: {
		name: "My Production",
	},
});
```

## System Overrides

The properties specific to [System Contexts](../runtime/contexts#system-contexts) can be overridden in production APIs.

This can be useful if you'd like a production's [Inputs](../concepts/inputs) to run in a virtual environment or otherwise augment system interactions.

For example, this Block production adds an authorization header to all network requests:

```ts
import { produceBlock } from "create";

import { blockUsingNetwork } from "./blockUsingNetwork";

await produceBlock(blockUsingNetwork, {
	fetcher: async (...args) => {
		const request = new Request(...args);
		request.headers.set("Authorization", "Bearer ...");
		return await fetch(request);
	},
});
```

:::tip
For testing productions in fully isolated environments, see [Testers](./testers).
:::
