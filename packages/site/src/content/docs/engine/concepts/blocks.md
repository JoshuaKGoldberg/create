---
description: "Generators for individual portions of a repository."
title: Blocks
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

A _Block_ defines the logic to create a portion of a repository.
Each Block is associated with a parent [Base](./bases).
Blocks can then be listed in [Presets](./presets) associated with the same base.

## Production

Blocks define their logic for created repository portions in a `produce()` function.
`produce()` returns a [Creation](../runtime/creations) describing any produced output.

When `create` scaffolds a repository from a Preset, it merges together the produced outputs from its listed Blocks.

For example, this Block describes creating a `.nvmrc` file:

```ts
import { base } from "./base";

export const blockNvmrc = base.createBlock({
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
import { base } from "./base";
import { blockNvmrc } from "./blockNvmrc";

export const presetVersioned = base.createPreset({
	blocks: [
		blockNvmrc(),
		// ...
	],
});
```

That `presetVersioned` would then produce an `.nvmrc` file with text content `20.12.2` when run.

```yml title=".nvmrc"
20.12.2
```

## Options

Each Block runs with the options defined by its parent [Base](./bases).

For example, a Base with a `name` option could create a Block that generates part of a README.md file:

```ts
import { base } from "./base";

export const blockREADME = base.createBlock({
	produce({ options }) {
		return {
			files: {
				"README.md": `# ${options.name}`,
			},
		};
	},
});
```

If `create` is run with `--name My Repository`, a `README.md` would be generated with that as its heading:

```md title="README.md"
# My Repository
```

## Args

Blocks may be extended with their own options, referred to as _Args_.
Blocks define args as the properties for a [Zod](https://zod.dev) object schema and then receive them in their context.

Args for a Block are typically specified each time a Block is defined in a [Preset](./presets)'s `blocks` array.
Each Preset may define instances of the Block with different Args.

For example, this Block takes in a string array under a `names` Arg, to be printed in a `names.txt` file:

```ts
import { z } from "zod";

import { base } from "./base";

export const blockNames = base.createBlock({
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
import { base } from "./base";
import { blockNames } from "./blockNames";

export const presetFruitNames = base.createPreset({
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

Creating with that `presetFruitNames` Preset would then produce a `names.txt` file with those three names as lines in its text:

```plaintext
// names.txt
apple
banana
cherry
```

## Addons

Blocks can produce Args to be passed to other Blocks.
These "addon" Args will be merged into the other Blocks' Args when run.

For example, this Vitest Block composes Args to an ESLint Block to include the Vitest ESLint plugin:

```ts
import { base } from "./base";
import { blockESLint } from "./blockESLint";

export const blockVitest = base.createBlock({
	produce() {
		return {
			addons: [
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

If `blockESLint` is included in the same Preset, it will receive those additional `extensions` and `imports` merged in with its own Args.

## APIs

- [`createBlock`](../apis/creators#createblock): for creating Blocks
- [`produceBlock`](../apis/producers#produceblock): for producing Block outputs
- [`testBlock`](../apis/testers#testblock): for simulating Block production
