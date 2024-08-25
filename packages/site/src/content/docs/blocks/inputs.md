---
title: Block Inputs
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Blocks can take in data from [inputs](../inputs/about).
Blocks will receive a `take` function in their context that executes an input.

For example, a block that adds all-contributors recognition using a JSON file input:

```ts
import { inputJSONFile } from "@example/input-json-data";

export const blockAllContributors = createBlock({
	async produce({ take }) {
		const existing = await take(inputJSONFile, {
			fileName: "package.json",
		});

		return {
			files: {
				".all-contributorsrc": JSON.parse({
					// ...
					contributors: existing?.contributors ?? [],
					// ...
				}),
			},
		};
	},
});
```

`create` will handle lazily evaluating inputs and retrieving user-provided inputs.
