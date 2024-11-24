---
title: Creator APIs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The main driver of `create` is a set of APIs that set up the generators for repositories:

- [`createBase`](#createbase): creates a new [Base](../concepts/bases)
  - [`createBlock`](#createblock): creates a new [Block](../concepts/blocks) for the Base
  - [`createPreset`](#createpreset): creates a new [Preset](../concepts/presets) for the Base
- [`createTemplate`](#createtemplate): creates a new [Template](../concepts/templates)
- [`createInput`](#createinput): creates a new [Input](../runtime/inputs)

## `createBase`

Given a _Base Definition_, creates a _Base_.

A Base Definition is an object containing:

- [`options`](#createbase-options) _(required)_: a [Base Options](../concepts/bases#options) object containing [Zod](https://zod.dev) values
- [`produce`](#createbase-produce) _(optional)_: a [Base production](../concepts/bases#production) function to fill in default options

### `options` {#createbase-options}

The [Zod](https://zod.dev) values for options that will be made available to the Base and all its [Blocks](../concepts/blocks).

For example, this Base defines a required `name` string and optional `value` number:

```ts
import { createBase } from "create";

export const base = createBase({
	options: {
		name: z.string(),
		value: z.number().optional(),
	},
});
```

### `produce` {#createbase-produce}

A Base may define a `produce` method to fill in any values that aren't inferred by the system at runtime.

`produce()` methods receive a [Base Context](../runtime/contexts#base-contexts) parameter.
They must return an object whose properties fill in any options that can be inferred from the system.
Each property may either be a value or an asynchronous function to retrieve that value.

For example, this Base allows defaulting a required `name` option to that property of its `package.json` using an [Input](./input):

```ts
import { createBase } from "create";
import { z } from "zod";

import { inputJsonFile } from "./inputJsonFile";

export const base = createBase({
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
Base Options aren't guaranteed to be inferrable in an existing repository.
Productions can also be run in a blank directory.
:::

#### Lazy Production

Note that `produce()` is itself not an async function.
This is to encourage options to be lazy: they should only be evaluated if needed.
The [`lazy-value`](https://www.npmjs.com/package/lazy-value) package can be used to create chained lazy properties.

For example, this Base retrieves both a `description` and a `name` from a `package.json` on disk lazily:

```ts
import { createBase } from "create";
import lazyValue from "lazy-value";
import { z } from "zod";

import { inputJsonFile } from "./inputJsonFile";

export const base = createBase({
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

For example, this Base defaults an optional `author` option to its required `owner` option:

```ts
import { createBase } from "create";
import { z } from "zod";

export const base = createBase({
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

When the Base's Presets are run, if the user provides an `author`, then they'll use that.
Otherwise, they'll default the `author` to whatever `owner` the user provided.

## `createBlock`

[Blocks](../concepts/blocks) can be created by the `createBlock()` method of a [Base](../concepts/bases).
`createBlock()` takes in a _Block Definition_ and returns a _Block_.

A Block Definition is an object containing:

- `about` _(optional)_: tooling metadata for the Block
- `args` _(optional)_: a [Block args](../concepts/blocks#args) object containing [Zod](https://zod.dev) values
- `produce` _(required)_: a [Block production](../concepts/blocks#production) method

### `about` {#createblock-about}

Metadata about the Block that can be used by tooling to describe it.

This is an object containing any of:

- `description`: a sentence describing what the Block does
- `name`: what to refer to the Block as

For example, this Block describes itself as setting up monorepo TypeScript building:

```ts
import { base } from "./base";

base.createBlock({
	about: {
		description: "TSConfigs and build tasks for a monorepo.",
		name: "TypeScript Builds",
	},
	produce() {
		// ...
	},
});
```

### `args` {#createblock-args}

Block Definitions may include an `args` object with defining [Zod](https://zod.dev) values as its properties.
Whenever a new instance of a Block with args is constructed, those args must be provided to it.

Block args are typically provided when a Block is being constructed in a [Preset](../concepts/presets)'s `blocks` array.
Those args are used to describe how the Block behaves inside that Preset.

For example, this Prettier block optionally allows adding in any plugins with a `plugins` arg:

```ts
import { z } from "zod";

import { base } from "./base";

export const blockPrettier = base.createBlock({
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
import { base } from "./base";
import { blockPrettier } from "./blockPrettier";

export const presetFormatted = base.createPreset({
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

### `produce` {#createblock-produce}

Block Definitions must include a `produce()` method for their core logic.

- It receives one parameter: a [Context](../runtime/contexts) object containing options as well as other utilities.
- It returns a [Creation](../runtime/creation) object describing the generated pieces of tooling.

For example, this Block defines a [`files` Creation](../runtime/creations#package) for a `knip.json`:

```ts
import { base } from "./base";

export const blockKnip = base.createBlock({
	produce() {
		return {
			files: {
				"knip.json": JSON.stringify({
					$schema: "https://unpkg.com/knip@latest/schema.json",
				}),
			},
		};
	},
});
```

## `createPreset`

[Presets](../concepts/presets) can be created by the `createPreset()` method of a [Base](../concepts/bases).
`createPreset()` takes in a _Preset Definition_ and returns a _Preset_.

A Preset Definition is an object containing:

- `about` _(optional)_: tooling metadata for the Preset
- `blocks` _(required)_: any number of [Blocks](../concepts/blocks) run by the Preset

### `about` {#createpreset-about}

Metadata about the Preset that can be used by tooling to describe it.

This is an object containing any of:

- `description`: a sentence describing what the Preset does
- `name`: what to refer to the Preset as

For example, this Preset describes itself as setting up a bare-bones TypeScript monorepo:

```ts
import { base } from "./base";

base.createPreset({
	about: {
		description: "The barest of bones tooling for a type-safe monorepo.",
		name: "Minimal",
	},
	blocks: [
		// ...
	],
});
```

### `blocks` {#createpreset-blocks}

The [Blocks](../concepts/blocks) that will be run to generate the Preset's [Creations](../runtime/creations) during production.

For example, this Preset includes blocks for building and testing:

```ts
import { base } from "./base";
import { blockBuilds } from "./blockBuilds";
import { blockTests } from "./blockTests";

base.createPreset({
	blocks: [blockBuilds, blockTests],
});
```

The Blocks provided to a Preset must be created from the same root [Base](../concepts/bases).

#### `blocks` Functions

A Preset's `blocks` can be defined as an array of Blocks or a function that takes in Options and returns an array of Blocks.
This allows Blocks to be given Args based on Options.

For example, this Preset forwards a `name` option as an configuration in an ESLint Block's Args:

```ts
import { base } from "./base";
import { blockESLint } from "./blockESLint";

base.createPreset({
	blocks: (options) => [
		blockESLint({
			rules: {
				files: ["**/*.md/*.ts"],
				rules: {
					"n/no-missing-import": [
						"error",
						{ allowModules: [options.repository] },
					],
				},
			},
		}),
	],
});
```

## `createTemplate`

Given a _Template Definition_, creates a _Template_.

A Template Definition is an object containing:

- `about` _(optional)_: tooling metadata for the Template
- `default` _(optional)_: Which Preset should be selected by default in CLIs
- `presets` _(required)_: an array of objects for the Presets available with the Template

### `about` {#createtemplate-about}

Metadata about the Template that can be used by tooling to describe it.

This is an object containing any of:

- `description`: a sentence describing what the Block does
- `name`: what to refer to the Block as

For example, this Template describes itself as a solution for TypeScript repositories:

```ts
import { createTemplate } from "create";

createTemplate({
	about: {
		description:
			"One-stop shop for the latest and greatest TypeScript tooling.",
		name: "Create TypeScript App",
	},
	presets: [
		// ...
	],
});
```

### `default` {#createtemplate-default}

The default Preset to select for users, if not the first in the array.

This should be the same string as one of the `labels` under [`presets`](#presets-createtemplate-presets).

For example, this Template defaults to the `"Common"` Preset:

```ts
import { createTemplate } from "create";

import { presetCommon } from "./presetCommon";
import { presetEverything } from "./presetEverything";

export const templateTypeScriptApp = createTemplate({
	default: "Common",
	presets: [
		{ label: "Common", preset: presetCommon },
		{ label: "Everything", preset: presetEverything },
	],
});
```

### `presets` {#createtemplate-presets}

The Presets users can choose from with the Template, in order of how they should be listed.

Each element in the array is an object containing:

- `label` _(required)_: a brief name for the Preset for text displays
- `preset` _(required)_: the Preset itself

For example, this Template allows choosing between two Presets for TypeScript apps:

```ts
import { createTemplate } from "create";

import { presetCommon } from "./presetCommon";
import { presetEverything } from "./presetEverything";

export const templateTypeScriptApp = createTemplate({
	about: {
		name: "TypeScript App",
	},
	presets: [
		{ label: "Common", preset: presetCommon },
		{ label: "Everything", preset: presetEverything },
	],
});
```

## `createInput`

Given an _Input Definition_, creates an _Input_.

An Input Definition is an object containing:

- `args` _(optional)_: a [Block args](../concepts/blocks#args) object containing [Zod](https://zod.dev) values
- `produce` _(required)_: an [Input production](../runtime/inputs#production) method

### `args` {#createinput-args}

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

### `produce` {#createinput-produce}

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
