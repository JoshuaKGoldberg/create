---
title: producePreset
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Given a [Preset](../concepts/presets) and options, `producePreset` runs the preset and produces a [Creation](../runtime/creations).

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

## Arguments

1. `preset` (required): a [Preset](../concepts/presets)
2. `settings` (required): production settings that must provide the full preset options

### Options

Preset options are generated through three steps:

1. Any options provided by `producePreset`'s second parameter's `options`
2. Calling the Preset's [Schema](../concepts/schemas)'s `produce` method, if it exists
3. Calling to an optional `augmentOptions` method of `producePreset`'s second parameter

#### `options`

Any number of options defined by the Preset's [Schema](../concepts/schemas).
If some options are missing from `options`, then they must be filled in by [`augmentOptions`](#augmentOptions).

#### `augmentOptions`

A function in the explicitly provided [`options`](#options) and fills in any remaining options.

`augmentOptions` runs _after_ the Preset's [Schema](../concepts/schemas)'s `produce` method, if it exists.
This

For example, this preset is provided a `first` option explicitly in `options`, generates `middle` by reading from disk, and generates its `last` option using `augmentOptions`:

```ts
import { createSchema, producePreset } from "create";
import { z } from "zod";

const schema = createSchema({
	options: {
		first: z.string(),
		last: z.string(),
		middle: z.string().optional(),
	},
	produce() {
		return {
			middle: Math.random() > 0.5 ? "Jr." : undefined,
		};
	},
});

const preset = schema.createPreset({
	blocks: [
		// ...
	],
});

await producePreset(preset, {
	augmentOptions({ options }) {
		return {
			last: `Mc${options.first}ton`,
		};
	},
	options: {
		first: "Name",
	},
});
```

### Context
