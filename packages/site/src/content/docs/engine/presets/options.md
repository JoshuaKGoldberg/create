---
title: Preset Options
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Presets will need to be able to take in options.
As with previous layers, they'll describe their options as the properties for a Zod object base.

For example, a preset that takes in keywords and forwards them to a `package.json` block:

```ts
import { blockPackageJson } from "@example/block-package-json";
import { z } from "zod";

import { base } from "./base";

export const myPreset = base.createPreset({
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
