---
title: Testing Presets
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The separate `create-testers` package includes testing utilities that provide mock data to an entity under test.
For [Presets](../concepts/presets), a `testPreset` function is exported that is analogous to [`producePreset`](../api/produce-preset).

For example, this test asserts that a Preset using an nvmrc Block creates an `".nvmrc"` file with content equal to its `version` option:

```ts
import { testPreset } from "create-testers";

import { presetWithNvmrc } from "./presetWithNvmrc";

describe("presetWithNvmrc", () => {
	it("returns an .nvmrc", () => {
		const actual = await testPreset(presetWithNvmrc, {
			options: {
				value: "20.12.2",
			},
		});

		expect(actual).toEqual({
			files: { ".nvmrc": "20.12.2" },
		});
	});
});
```

## Arguments

1. `preset` (required): a [Preset](../concepts/presets)
2. `settings` (optional): production settings including the Preset's Schema's [Options](../concepts/schemas#options)

`settings` and all its properties are optional, with the same caveat as `producePreset` that `options` and/or `optionsAugment` must create the Preset's Schema's options.

### `system`

[System Context](../runtime/contexts#system-contexts) properties default to the same native system calls used in [`producePreset`](../api/produce-preset).
However, each may be substituted out for a

## Return

As with [`producePreset`](../api/produce-preset), `testPreset` returns a Promise for the Preset's [`Creation`](../runtime/creations).
Both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations) will be present.
