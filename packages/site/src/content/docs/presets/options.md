---
title: Preset Options
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Presets will need to be able to take in options. As with previous layers, they'll describe their options as the properties for a Zod object schema.

For example, a preset that takes in keywords and forwards them to a `package.json` block:

```ts
import { createPreset } from "@create-/preset";
import { blockPackageJson } from "@example/block-package-json";
import { z } from "zod";

export const myPreset = createPreset({
	options: {
		keywords: z.array(z.string()),
	},
	produce({ options }) {
		return [
			blockPackageJson({
				keywords: options.keywords,
			}),
		];
	},
});
```
