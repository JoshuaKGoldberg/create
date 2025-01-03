---
description: "Generators for individual portions of a repository."
title: Blocks
---

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
		blockNvmrc,
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

## Addons

Blocks can define additional optional data called _"Addons"_ that they can be receive from other Blocks.
Blocks define Addons as the properties for a [Zod](https://zod.dev) object schema and then receive them in their context.

For example, this Block takes in a string array under a `names` Addon, to be printed in a `names.txt` file:

```ts
import { z } from "zod";

import { base } from "./base";

export const blockNames = base.createBlock({
	addons: {
		names: z.array(z.string()).default([]),
	},
	async produce({ addons }) {
		return {
			files: {
				"names.txt": addons.names.join("\n"),
			},
		};
	},
});
```

Other Blocks may produce Addons to be given to any other Blocks.
These Addons will be merged together when a Preset containing the Blocks is run.

For example, this FruitNames Block composes Addons to the Names Block:

```ts
import { base } from "./base";

export const blockNames = base.createBlock({
	async produce() {
		return {
			addons: [
				blockNames({
					names: ["apple", "banana", "cherry"],
				}),
			],
		};
	},
});
```

A Preset containing both Blocks would then produce a `names.txt` file with those three names as lines in its text:

```plaintext
// names.txt
apple
banana
cherry
```

## APIs

- [`createBlock`](../apis/creators#createblock): for creating Blocks
- [`produceBlock`](../apis/producers#produceblock): for producing Block outputs
- [`testBlock`](../apis/testers#testblock): for simulating Block production
