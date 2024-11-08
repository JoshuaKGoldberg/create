---
title: Creator APIs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The main driver of `create` is a set of APIs that set up the generators for repositories:

- [`createSchema`](#createschema): creates a new [Schema](../concepts/schemas)
  - [`createBlock`](#createblock): creates a new [Block](../concepts/blocks) for the Schema
  - [`createPreset`](#createpreset): creates a new [Preset](../concepts/presets) for the Schema
- [`createInput`](#createinput): creates a new [Input](../concepts/inputs)

## `createSchema`

Given a _Schema Definition_, creates a _Schema_.

A Schema Definition is an object containing:

- [`options`](#schema-options) _(required)_: a [Schema options](../concepts/schemas#options) object containing [Zod](https://zod.dev) values
- [`produce`](#schema-produce) _(optional)_: a [Schema production](../concepts/schemas#production) function to fill in default options

### `options` {#schema-options}

The [Zod](https://zod.dev) values for options that will be made available to the Schema and all its [Blocks](../concepts/blocks).

For example, this Schema defines a required `name` string and optional `value` number:

```ts
import { createSchema } from "create";

export const schema = createSchema({
	options: {
		name: z.string(),
		value: z.number().optional(),
	},
});
```

### `produce` {#schema-produce}

A Schema may define a `produce` method to fill in any values that aren't inferred by the system at runtime.

`produce()` methods receive a [Schema Context](../runtime/contexts#schema-contexts) parameter.
They must return an object whose properties fill in any options that can be inferred from the system.
Each property may either be a value or an asynchronous function to retrieve that value.

For example, this schema allows defaulting a required `name` option to that property of its `package.json` using an [Input](./input):

```ts
import { createSchema } from "create";
import { z } from "zod";

import { inputJsonFile } from "./inputJsonFile";

export const schema = createSchema({
	options: {
		name: z.string(),
	},
	produce({ take }) {
		return {
			name: async () =>
				(await take(inputJsonFile, { fileName: "package.json" })).name,
		};
	},
});
```

:::tip
Schema options aren't guaranteed to be inferrable in an existing repository.
Productions can also be run in a blank directory.
:::

#### Lazy Production

Note that `produce()` is itself not an async function.
This is to encourage options to be lazy: they should only be evaluated if needed.
The [`lazy-value`](https://www.npmjs.com/package/lazy-value) package can be used to create chained lazy properties.

For example, this Schema retrieves both a `description` and a `name` from a `package.json` on disk lazily:

```ts
import { createSchema } from "create";
import lazyValue from "lazy-value";
import { z } from "zod";

import { inputJsonFile } from "./inputJsonFile";

export const schema = createSchema({
	options: {
		description: z.string(),
		name: z.string(),
	},
	produce({ take }) {
		const packageData = lazyValue(async () =>
			take(inputJsonFile({ fileName: "package.json" })),
		);

		return {
			description: async () => (await packageData()).description,
			name: async () => (await packageData()).name,
		};
	},
});
```

That `produce()` will only read and parse the `package.json` file if either of `description` and/or `name` are not provided by the user.

#### Production Options

`produce()`'s Context parameter contains an `options` property with any options explicitly provided by the user.
This may be useful if the logic to produce some options should set defaults based on other options.

For example, this Schema defaults an optional `author` option to its required `owner` option:

```ts
import { createSchema } from "create";
import { z } from "zod";

export const schema = createSchema({
	options: {
		author: z.string().optional(),
		owner: z.string(),
	},
	produce({ options }) {
		return {
			author: options.owner,
		};
	},
});
```

When the Schema's Presets are run, if the user provides an `author`, then they'll use that.
Otherwise, they'll default the `author` to whatever `owner` the user provided.

## `createBlock`

[Blocks](../concepts/blocks) can be created by the `createBlock()` _"Block Factory"_ method of a [Schema](../concepts/schemas).
`createBlock()` takes in a _Block Definition_ and returns a _Block_.

A Block Definition is an object containing:

- `about` _(optional)_: tooling metadata for the Block
- `args` _(optional)_: a [Block args](../concepts/blocks#args) object containing [Zod](https://zod.dev) values
- `phase` _(optional)_: which [Block Phase](../runtime/phases) the block executes during
- `produce` _(required)_: a [Block production](../concepts/blocks#production) method

### `about` {#block-about}

Metadata about the Block that can be used by tooling to describe it.

This is an object containing any of:

- `description`: a sentence describing what the Block does
- `name`: what to refer to the Block as

For example, this Block describes itself as setting up monorepo TypeScript building:

```ts
import { schema } from "./schema";

schema.createBlock({
	about: {
		description: "TSConfigs and build tasks for a monorepo.",
		name: "TypeScript Builds",
	},
	produce() {
		// ...
	},
});
```

### `args` {#block-args}

Block Definitions may include an `args` object with defining [Zod](https://zod.dev) values as its properties.
Whenever a new instance of a Block with args is constructed, those args must be provided to it.

Block args are typically provided when a Block is being constructed in a [Preset](../concepts/presets)'s `blocks` array.
Those args are used to describe how the Block behaves inside that Preset.

For example, this Prettier block optionally allows adding in any plugins with a `plugins` arg:

```ts
import { z } from "zod";

import { schema } from "./schemas";

export const blockPrettier = schema.createBlock({
	args: {
		plugins: z.array(z.string()).optional(),
	},
	async produce({ args }) {
		return {
			files: {
				".prettierrc.json":
					args.plugins &&
					JSON.stringify({
						$schema: "http://json.schemastore.org/prettierrc",
						plugins: args.plugins,
					}),
			},
		};
	},
});
```

Presets can then specify the `blockPrettier` Block with `plugins` arg set to an array:

```ts
import { blockPrettier } from "./blockPrettier";
import { schema } from "./schema";

export const presetFormatted = schema.createPreset({
	blocks: [
		blockPrettier({
			plugins: [
				"prettier-plugin-curly",
				"prettier-plugin-sh",
				"prettier-plugin-packagejson",
			],
		}),
		// ...
	],
});
```

Creating with that `presetFormatted` Preset would then produce a `.prettierrc.json` file with those three plugins listed in its JSON contents.

### `phase` {#block-phase}

Controls what [Block Phase](../runtime/phases) the Block executes in.
This is specified as a value of the exported `BlockPhase` enum.

`phase` defaults to `BlockPhase.Default`, the first set of run Blocks, if not provided.

For example, this Block adds text for every previously-generated piece of [`documentation`](../runtime/creations#documentation):

```ts
import { BlockPhase } from "create";

import { schema } from "../schema.js";

export const blockGitignore = schema.createBlock({
	phase: BlockPhase.Documentation,
	produce({ created }) {
		return {
			files: {
				"DEVELOPMENT.md": [
					`# Development`,
					...Object.fromEntries(created.documentation).map(
						([title, contents]) => `## ${title}\n\n${contents}`,
					),
				].join("\n\n"),
			},
		};
	},
});
```

See [Creations > Indirect Creations](../runtime/creations#indirect-creations) for the values Blocks can read from Blocks run in earlier Phases.

### `produce` {#block-produce}

Block Definitions must include a `produce()` method for their core logic.

- It receives one parameter: a [Context](../runtime/contexts) object containing options as well as other utilities.
- It returns a [Creation](../runtime/creation) object describing the generated pieces of tooling.

For example, this Block defines a [`package` Creation](../runtime/creations#package) for a test script to run Vitest:

```ts
import { schema } from "./schema";

export const blockKnip = schema.createBlock({
	produce() {
		return {
			package: {
				scripts: {
					test: "vitest",
				},
			},
		};
	},
});
```

## `createPreset`

[Presets](../concepts/presets) can be created by the `createPreset()` _"Preset Factory"_ method of a [Schema](../concepts/schemas).
`createPreset()` takes in a _Preset Definition_ and returns a _Preset_.

A Preset Definition is an object containing:

- `about` _(optional)_: tooling metadata for the Preset
- `blocks` _(required)_: any number of [Blocks](../concepts/blocks) run by the Preset

### `about` {#preset-about}

Metadata about the Preset that can be used by tooling to describe it.

This is an object containing any of:

- `description`: a sentence describing what the Preset does
- `name`: what to refer to the Preset as

For example, this Preset describes itself as setting up a TypeScript monorepo:

```ts
import { schema } from "./schema";

schema.createPreset({
	about: {
		description:
			"Building, linting, and other tooling for a type-safe monorepo.",
		name: "TypeScript Monorepo",
	},
	blocks: [
		// ...
	],
});
```

### `blocks` {#preset-blocks}

The Blocks that will be run to generate the Preset's [Creations](../runtime/creations) during production.

Blocks will be evaluated in their [Phase](../runtime/phases) order.
Blocks with the same Phase will be evaluated by the order they're defined in the Preset.

For example, this Preset includes blocks for building and testing:

```ts
import { blockBuilds } from "./blockBuilds";
import { blockTests } from "./blockTests";
import { schema } from "./schema";

schema.createPreset({
	blocks: [blockBuilds(), blockTests()],
});
```

The Blocks provided to a Preset must be created from the same root [Schema](../concepts/schemas).

## `createInput`

Given an _Input Definition_, creates an _Input_.

An Input Definition is an object containing:

- `args` _(optional)_: a [Block args](../concepts/blocks#args) object containing [Zod](https://zod.dev) values
- `produce` _(required)_: an [Input production](../concepts/inputs#production) method

### `args` {#input-args}

Input Definitions may include an `args` object with defining [Zod](https://zod.dev) values as its properties.
Whenever an Input with args is passed to [`take`](../runtime/contexts#take), those args must be provided to it.

For example, this Input defines a required `path` string:

```ts
import { createInput } from "create";
import { z } from "zod";

export const inputFile = createInput({
	args: {
		path: z.string(),
	},
	async produce({ args, fs }) {
		return await fs.readFile(args.path);
	},
});
```

### `produce` {#input-produce}

Input Definitions must include a `produce()` method for their core logic.

- It receives one parameter: a [Context](../runtime/contexts#input-contexts) object
- It can return any kind of data.

For example, this Input fetches text from a URL:

```ts
import { createInput } from "create";

export const inputNow = createInput({
	async produce({ fetcher }) {
		return await (await fetcher("https://example.com")).text();
	},
});
```
