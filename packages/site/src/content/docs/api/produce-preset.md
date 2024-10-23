---
title: producePreset
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Given a [Preset](../concepts/presets), `producePreset` runs the Preset and produces a [Creation](../runtime/creations).

```ts
import { producePreset, Schema } from "create";
import { z } from "zod";

declare const schema: Schema<{ name: z.ZodString }>;

const preset = schema.createPreset({
	blocks: [
		// ...
	],
});

const creation = await producePreset(preset);

console.log(creation);
```

## Arguments

1. `preset` (required): a [Preset](../concepts/presets)
2. `settings` (required): production settings that must provide the Preset's full options

Preset options are generated through three steps:

1. Any options provided by `producePreset`'s second parameter's `options`
2. Calling the Preset's [Schema](../concepts/schemas)'s `produce` method, if it exists
3. Calling to an optional `optionsAugment` method of `producePreset`'s second parameter

### `options`

Any number of options defined by the Preset's [Schema](../concepts/schemas).

For example, this Preset is run with a `name` option:

```ts
import { producePreset } from "create";
import { z } from "zod";

declare const preset: Preset<{ name: z.ZodString }>;

await producePreset(preset, {
	options: {
		name: "My Production",
	},
});
```

If some options are missing from `options`, then they must be filled in by [`optionsAugment`](#optionsaugment).

### `optionsAugment`

A function that takes in the explicitly provided [`options`](#options) and returns any remaining options.

`optionsAugment` runs _after_ the Preset's [Schema](../concepts/schemas)'s `produce` method, if it exists.
This can be useful to prompt for any options not determined by `produce()`.

For example, this `optionsAugment` uses a Node.js prompt to fill in a `name` option if it can't be inferred from disk:

```ts
import { createSchema, producePreset } from "create";
import readline from "node:readline/promises";
import { z } from "zod";

import { inputTextFile } from "./inputs/inputTextFile";

const schema = createSchema({
	options: {
		name: z.string(),
	},
	produce({ take }) {
		return {
			name: await take(inputTextFile, { fileName: "name.txt" }),
		};
	},
});

const preset = schema.createPreset({
	blocks: [
		// ...
	],
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

await producePreset(preset, {
	optionsAugment({ options }) {
		return {
			last: options.last ?? (await rl.question("What is your name?")),
		};
	},
});
```

### `system`

An optional [System Context](../runtime/contexts#system-contexts) to use for interfacing with the host operating system.

By default, `system` calls to Node.js methods for file system, network calls, and shell scripts.

You can substitute this out to prevent your Preset from interfacing with them.
For example, this set of stubs logs what the Preset would do instead of taking those actions:

```ts
import { producePreset } from "create";
import { z } from "zod";

declare const preset: Preset<{ name: z.ZodString }>;

function stub(label: string) {
	return (...args: unknown[]) => {
		console.log(`[${label}]`, ...args);
	};
}

await producePreset(preset, {
	options: {
		name: "My Production",
	},
	system: {
		fetcher: stub("fetcher"),
		fs: {
			readFile: stub("readFile"),
			writeDirectory: stub("writeDirectory"),
			writeFile: stub("writeFile"),
		},
		runner: stub("runner"),
		take: stub("take"),
	},
});
```

:::tip
See [Testing > Presets](../testing/presets) for how to use `system` in testing presets.
:::

## Return

`producePreset` returns a Promise for the Preset's [`Creation`](../runtime/creations).
Both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations) will be present.
