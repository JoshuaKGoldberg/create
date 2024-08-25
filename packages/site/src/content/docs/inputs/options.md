---
title: Input Options
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Inputs will need to be reusable and able to take in options.
They'll describe those options as the properties of a Zod object schema.
That will let them validate provided values and infer types from an `options` property in their context.

For example, an input that retrieves JSON data from a file on disk using the provided virtual file system:

```ts
import { createInput } from "create";
import { z } from "zod";

export const inputJSONFile = createInput({
	options: {
		fileName: z.string(),
	},
	async produce({ fs, options }) {
		try {
			return JSON.parse((await fs.readFile(options.fileName)).toString());
		} catch {
			return undefined;
		}
	},
});
```

Later on, blocks and addons that use the input will be able to provide those options.
