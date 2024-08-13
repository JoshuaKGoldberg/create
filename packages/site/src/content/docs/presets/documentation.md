---
title: Documentation
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

For example, the scaffolding of a block that generates documentation for a preset from its entry point:

```ts
import { createBlock } from "@create-/block";
import { z } from "zod";

createBlock({
	options: {
		entry: z.string().default("./src/index.ts"),
	},
	produce({ options }) {
		return {
			metadata: {
				documentation: {
					"README.md": `## Preset Options ...`,
				},
			},
		};
	},
});
```
