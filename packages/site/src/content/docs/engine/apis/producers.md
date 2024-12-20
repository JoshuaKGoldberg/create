---
title: Producer APIs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Production APIs can be used to create [Creations](../runtime/creations):

- [`produceBase`](#producebase): generates [Base](../concepts/bases) options
- [`produceBlock`](#produceblock): runs a [Block](../concepts/blocks) production
- [`produceInput`](#produceinput): runs an [Input](../concepts/inputs)
- [`producePreset`](#producepreset): runs a [Preset](../concepts/presets) production

Each production API takes in up to two arguments:

1. The construct to be produced
2. An object with properties from the construct's context as well as [System contexts](../runtime/contexts#system-contexts)

:::note
Production APIs only generate objects in memory.
For APIs that apply those objects, see [Runners](./runners).
:::

## `produceBase`

Given a [Base](../concepts/bases), creates an options object by running its [`produce()`](../concepts/bases#production).

`produceBase` takes in up to two argument:

1. `base` _(required)_: a Base
2. `settings` _(optional)_: any properties from a [Base Context](../runtime/contexts#base-contexts), except for `take`

`produceBase` returns a Promise for the resultant [Creation](../runtime/creations).

For example, given this Base that declares an optional `value` option that defaults to `"default"`, `produceBase` can run its `produce()` with any provided options:

```ts
import { createBase, produceBase } from "create";
import { z } from "zod";

const base = createBase({
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
await produceBase(base);

// { value: "override" }
await produceBase(base, {
	options: {
		value: "override",
	},
});
```

:::tip
If the Base does not define a `produce()`, then `settings.options` is returned.
:::

### `options` {#producebase-options}

Any number of options defined by the base.

For example, this Base is run with a `name` option:

```ts
import { Base } from "create";
import { z } from "zod";

declare const base: Base<{ name: z.ZodString }>;

await produceBase(base, {
	options: {
		name: "My Production",
	},
});
```

## `produceBlock`

Given a [Block](../concepts/blocks), creates a [Creation](../runtime/creations) output by running its [`produce()`](../concepts/blocks#production).

`produceBlock` takes in up to two arguments:

1. `block` _(required)_: a Block
2. `settings` _(required)_: at least `options`, as well as any other properties from a [Block Context](../runtime/contexts#block-contexts)

For example, given this Block that produces the start of a README.md file, `produceBlock` can run its `produce()` with any provided options:

```ts
import { produceBlock } from "create";

import { base } from "./base";

const blockReadme = base.createBlock({
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

For example, given this Block with a `prefix` Arg and a `name` Option, both can be specified in `produceBlock`:

```ts
import { Block } from "create";

declare const block: Block<{ prefix: string }, { name: string }>;

await produceBlock(block, {
	args: {
		prefix: "The",
	},
	options: {
		name: "Production",
	},
});
```

### `created` {#produceblock-created}

Any [Creations](../runtime/contexts#created) to simulate having been made from previously-produced Blocks.

### `options` {#produceblock-options}

Any number of options defined by the Block's [Base](../concepts/bases).

For example, this Block is run with no Args and one `name` Option:

```ts
import { Block } from "create";

declare const block: Block<never, { name: string }>;

await produceBlock(block, {
	options: {
		name: "My Production",
	},
});
```

## `produceInput`

Given an [Input](../runtime/inputs), runs its `produce()` with any provided args.

`produceInput` takes in up to two arguments:

1. `input` _(required)_: an Input
2. `settings` _(required)_: at least `options`, as well as any other properties from an [Input Context](../runtime/contexts#input-contexts) other than `take`

`produceInput` returns a Promise for the result of the Input's [`produce()`](./creators#createinput-produce).

For example, this Input production reads data from an existing `data.json` file on disk:

```ts
import { createInput, produceInput } from "create";

const inputDataJson = createInput({
	async produce({ fs }) {
		return await JSON.parse(await fs.readFile("data.json"));
	},
});

// Type: string
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
   - `options` _(required)_: [Base](../concepts/bases) options to run with
   - _(optional)_ any other properties from a [Block Context](../runtime/contexts#block-contexts)

`producePreset` returns a Promise for an object containing:

- `creation`: The Preset's [`Creation`](../runtime/creations), including both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations)
- `options`: The full merged options that production ran with

For example, given this Preset that includes the block from [`produceBlock`](#produceblock), `producePreset` can run its `produce()` with any provided options:

```ts
import { producePreset } from "create";

import { base } from "./base";
import { blockReadme } from "./blockReadme";

const preset = base.createPreset({
	blocks: [blockReadme],
});

// { creation: { files: { "README.md": `# My App` }}, options: { title: "My App" } }
await producePreset(preset, { options: { title: "My App" } });
```

### `options` {#preset-options}

Any options defined by the Preset's [Base](../concepts/bases).

This must include all required Options from the Base.
It may also include any other optional Options.

For example, this Preset is run with a `name` option:

```ts
import { Preset, producePreset } from "create";
import { z } from "zod";

declare const preset: Preset<{ name: z.ZodString }>;

await producePreset(preset, {
	options: {
		name: "My Production",
	},
});
```

## System Overrides

The properties specific to [System Contexts](../runtime/contexts#system-contexts) can be overridden in production APIs.

This can be useful if you'd like a production's [Inputs](../runtime/inputs) to run in a virtual environment or otherwise augment system interactions.

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
