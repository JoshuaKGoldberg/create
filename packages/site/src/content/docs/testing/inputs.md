---
title: Testing Inputs
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

The `create-testers` package will include testing utilities that provide mock data to an _input_ under test.

For example, testing the [previous `inputJSONFile`](../inputs/options):

```ts
import { createMockInputContext } from "create-testers";

import { inputJSONFile } from "./inputJSONFile";

describe("inputJSONFile", () => {
	it("returns package data when the file on disk contains valid JSON", () => {
		const expected = { name: "mock-package" };
		const context = createMockInputContext({
			files: {
				"package.json": JSON.stringify(expected),
			},
			options: {
				fileName: "package.json",
			},
		});

		const actual = await inputJSONFile(context);

		expect(actual).toEqual(expected);
	});
});
```
