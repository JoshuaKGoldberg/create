---
title: Input Composition
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Inputs should be composable: meaning each can take data from other inputs.
`create` will include a `take` function in contexts that calls another input with the current context.

For example, an input that determines the npm username based on either `npm whoami` or `package.json` inputs:

```ts
import { inputJSONFile } from "@example/input-json-data";
import { inputNpmWhoami } from "@example/input-npm-whoami";
import { createInput } from "create";

export const inputNpmUsername = createInput({
	async produce({ take }) {
		return (
			(await take(inputNpmWhoami)) ??
			(await take(inputJSONFile, { fileName: "package.json" })).author
		);
	},
});
```
