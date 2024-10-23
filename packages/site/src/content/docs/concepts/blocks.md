---
description: "Generators for individual portions of a repository."
title: Blocks
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

A _Block_ defines the logic to create a portion of a repository.
Blocks are created by calling a _Block Factory_ that can be generated from a [Schema](./schemas).

Block Factories define a `produce()` method for their core logic:

- It receives one parameter: a [Context](../runtime/contexts) object containing options as well as other utilities.
- It returns a [Creation](../runtime/creation) object describing the generated pieces of tooling.

When `create` scaffolds a repository, it merges together the produced outputs from all Blocks.

For example, this block describes creating a `.nvmrc` file:

```ts
import { schema } from "./schema";

export const blockNvmrc = schema.createBlock({
	produce() {
		return {
			files: {
				".nvmrc": "20.12.2",
			},
		};
	},
});
```

That `blockNvmrc` can then be listed in a [Preset](./presets)'s `blocks` array:

```ts
import { blockNvmrc } from "./blockNvmrc";
import { schema } from "./schema";

export const presetCreateMyApp = schema.createPreset({
	about: {
		name: "Create My App",
	},
	blocks: [
		blockNvmrc(),
		// ...
	],
});
```

That `presetCreateMyApp` would then produce an `.nvmrc` file with text content `20.12.2` when run.

## Options

Each Block runs with the options defined by its parent [Schema](./schemas).

For example, a Schema with a `name` option could create a Block that generates part of a README.md file:

```ts
import { schema } from "./schema";

export const blockREADME = schema.createBlock({
	produce({ options }) {
		return {
			files: {
				"README.md": `# ${options.name}`,
			},
		};
	},
});
```

## Args

Blocks may be extended with their own options, referred to as _args_.
Blocks define args as the properties for a Zod object schema and then receive them in their context.

For example, a Prettier block that optionally allows adding in any plugins:

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

That `blockPrettier` can then be listed in a [Preset](./presets)'s `blocks` array:

```ts
import { blockPrettier } from "./blockPrettier";
import { schema } from "./schema";

export const presetCreateMyApp = schema.createPreset({
	about: {
		name: "Create My App",
	},
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

That `presetCreateMyApp` would then produce a `.prettierrc.json` file with those three plugins listed in its JSON contents.

## Inputs

Blocks can take in data from [Inputs](../inputs/about).
Blocks receive a `take` function in their context that executes an input.

For example, a Blocks that adds all-contributors recognition using a JSON file input:

```ts
import { inputJSONFile } from "@example/input-json-data";

export const blockAllContributors = createBlock({
	async produce({ take }) {
		const existing = await take(inputJSONFile, {
			fileName: "package.json",
		});

		return {
			files: {
				".all-contributorsrc": JSON.stringify({
					// ...
					contributors: existing?.contributors ?? [],
					// ...
				}),
			},
		};
	},
});
```

`create` will handle lazily evaluating inputs and retrieving user-specified inputs.

:::note
Blocks aren't required to use Inputs for dynamic data.
Doing so just makes that data easier to [mock out in tests](../testing/inputs) later on.
:::
