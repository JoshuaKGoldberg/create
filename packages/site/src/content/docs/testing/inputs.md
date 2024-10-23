---
title: Testing Inputs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The separate `create-testers` package includes testing utilities that provide mock data to an _input_ under test.

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
