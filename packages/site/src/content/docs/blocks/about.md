---
description: "Each tooling piece outputting files, network requests, and/or shell commands."
title: About Blocks
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

The main logic for template contents will be stored in blocks. Each will define its shape of user-provided options and resultant outputs.

Resultant outputs will be passed to `create` to be merged with other _blocks'_ outputs and applied. Outputs may include:

- Cleanup scripts to run after setup
- Files to create or modify on disk
- Network requests to the GitHub API
- Packages to install

For example, a block that adds a `.nvmrc` file:

```ts
import { createBlock } from "@create-/block";

export const blockNvmrc = createBlock({
	async produce() {
		return {
			files: {
				".nvmrc": "20.12.2",
			},
		};
	},
});
```
