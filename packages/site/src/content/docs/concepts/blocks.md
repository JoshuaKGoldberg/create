---
description: "Generators for individual portions of a repository."
title: Blocks
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

A _Block_ defines the logic to create a portion of a repository.
Each Block is associated with a parent [Schema](./schemas).
Blocks can then be listed in [Presets](./presets) associated with the same Schema.

## Production

Blocks define their logic for created repository portions in a `produce()` function.
`produce()` returns a [Creation](../runtime/creations) describing any produced output.

When `create` scaffolds a repository from a Preset, it merges together the produced outputs from its listed Blocks.

For example, this Block describes creating a `.nvmrc` file:

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

export const presetVersioned = schema.createPreset({
	blocks: [
		blockNvmrc(),
		// ...
	],
});
```

That `presetVersioned` would then produce an `.nvmrc` file with text content `20.12.2` when run.

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
Blocks define args as the properties for a [Zod](https://zod.dev) object schema and then receive them in their context.

Args for a Block are typically specified each time a Block is defined in a [Preset](./presets)'s `blocks` array.
Each Preset may define instances of the Block with different args.

For example, this Block takes in a string array under a `names` arg, to be printed in a `names.txt` file:

```ts
import { z } from "zod";

import { schema } from "./schemas";

export const blockNames = schema.createBlock({
	args: {
		names: z.array(z.string()),
	},
	async produce({ args }) {
		return {
			files: {
				"names.txt": args.names.join("\n"),
			},
		};
	},
});
```

The `blockNames` Block would then require `names` be provided when constructed, such as in a Preset:

```ts
import { blockNames } from "./blockNames";
import { schema } from "./schema";

export const presetFruitNames = schema.createPreset({
	about: {
		name: "Create My App",
	},
	blocks: [
		blockNames({
			names: ["apple", "banana", "cherry"],
		}),
	],
});
```

Creating with that `presetFruitNames` Preset would then produce a `names.txt` file with those three names as lines in its text.

## Composition

:::danger
**Args composition has not been implemented yet.**
:::

Blocks can producing Args to be passed to other Blocks.
These "composed" Args will be merged into the other Blocks' arguments when run.

For example, this Vitest Block composes Args to an ESLint Block to include the Vitest ESLint plugin:

```ts
import { blockESLint } from "./blockESLint";
import { schema } from "./schema";

export const blockVitest = schema.createBlock({
	produce() {
		return {
			composed: [
				blockESLint({
					extensions: [
						{
							extends: ["vitest.configs.recommended"],
							files: ["**/*.test.*"],
						},
					],
					imports: [{ source: "@vitest/eslint-plugin", specifier: "vitest" }],
				}),
			],
			files: {
				// ...
			},
			// ...
		};
	},
});
```

:::note
A Block producing Args compositions does not change the output of the Block.
Composed Args are only used when a parent [Preset](./presets) is produced.
:::

:::caution
A Block's composed Args must only impact Blocks with a later [Phase](../runtime/phases).
If a Block produces composed Args for a Block that was already run, `create` will throw an error.
:::

## APIs

- [`createBlock`](../apis/creators#createblock): for creating Blocks
- [`produceBlock`](../apis/producers#produceblock): for producing Schema Options
- [`testBlock`](../apis/testers#testblock): for simulating Block production
