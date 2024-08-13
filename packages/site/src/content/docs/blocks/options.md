---
title: Block Options
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Blocks may be configurable with user options. They will define them as the properties for a Zod object schema and then receive them in their context.

For example, a block that adds Prettier formatting with optional Prettier options:

```ts
import { createBlock } from "@create-/block";
import prettier from "prettier";
import { prettierSchema } from "zod-prettier-schema"; // todo: make package
import { z } from "zod";

export const blockPrettier = createBlock({
	options: {
		config: prettierSchema.optional(),
	},
	async produce({ options }) {
		return {
			files: {
				".prettierrc.json":
					options.config &&
					JSON.stringify({
						$schema: "http://json.schemastore.org/prettierrc",
						...config,
					}),
			},
			packages: {
				devDependencies: ["prettier"],
			},
			scripts: {
				format: "prettier .",
			},
		};
	},
});
```
