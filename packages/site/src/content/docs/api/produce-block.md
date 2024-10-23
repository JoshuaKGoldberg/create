---
title: produceBlock
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Given a [Block](../concepts/blocks) and options, `produceBlock` runs the block and produces a [Creation](../runtime/creations).

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
