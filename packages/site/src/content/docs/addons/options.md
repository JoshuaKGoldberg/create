---
title: Addon Options
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Addons may be configurable with user options similar to inputs and blocks. They should be able to describe their options as the properties for a Zod object schema, then infer types for their context.

For example, a Perfectionist linting addon for a rudimentary ESLint linting block with options for partitioning objects:

```ts
import { createAddon } from "@create-/addon";
import { blockESLint, BlockESLintOptions } from "@example/block-eslint";
import { z } from "zod";

export const addonESLintPerfectionist = createAddon({
	options: {
		partitionByComment: z.boolean(),
	},
	produce({ options }): AddonOutput<BlockESLintOptions> {
		return {
			options: {
				configs: [`perfectionist.configs["recommended-natural"]`],
				imports: `import perfectionist from "eslint-plugin-perfectionist"`,
				rules: options.partitionByComment && {
					"perfectionist/sort-objects": [
						"error",
						{
							order: "asc",
							partitionByComment: true,
							type: "natural",
						},
					],
				},
			},
		};
	},
});
```
