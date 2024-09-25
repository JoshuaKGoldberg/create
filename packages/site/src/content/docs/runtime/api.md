---
title: API
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

## `producePreset`

Given a [Preset](../concepts/presets) and options, this runs the preset and produces a [Creation](../runtime/creations).

```ts
import { producePreset } from "create";
import { z } from "zod";

declare const preset: Preset<{ name: z.ZodString }>;

await producePreset({
	options: {
		name: "My Production",
	},
	preset,
});
```
