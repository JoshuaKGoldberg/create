---
title: Testing Blocks
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

The `create-testers` package will include testing utilities that provide mock data to a block under test.

For example, this test asserts that an nvmrc block creates an `".nvmrc"` file with content `"20.12.2"`:

```ts
import { createMockBlockContext } from "create-testers";

import { blockNvmrc } from "./blockNvmrc";

describe("blockNvmrc", () => {
	it("returns an .nvmrc", () => {
		const context = createMockBlockContext();

		const actual = await blockNvmrc(context);

		expect(actual).toEqual({ ".nvmrc": "20.12.2" });
	});
});
```

## Options

Block options may also be provided through `createMockBlockContext()`.

This test asserts that a Prettier block adds config options to its output `".prettierrc.json"`:

```ts
import { createMockBlockContext } from "create-testers";

import { blockPrettier } from "./blockPrettier";

describe("blockPrettier", () => {
	it("creates a .prettierrc.json when provided options", () => {
		const prettierConfig = {
			useTabs: true,
		};
		const context = createMockBlockContext({
			options: {
				config: prettierConfig,
			},
		});

		const actual = await blockPrettier(context);

		expect(actual).toEqual({
			files: {
				".prettierrc.json": JSON.stringify({
					$schema: "http://json.schemastore.org/prettierrc",
					...prettierConfig,
				}),
			},
			packages: {
				devDependencies: ["prettier"],
			},
			scripts: {
				format: "prettier .",
			},
		});
	});
});
```
