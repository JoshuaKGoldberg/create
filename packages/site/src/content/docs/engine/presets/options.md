---
title: Preset Options
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Presets will need to be able to take in options.
As with previous layers, they'll describe their options as the properties for a Zod object schema.

For example, a preset that takes in keywords and forwards them to a `package.json` block:

```ts
import { blockPackageJson } from "@example/block-package-json";
import { z } from "zod";

import { schema } from "./schema";

export const myPreset = schema.createPreset({
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
