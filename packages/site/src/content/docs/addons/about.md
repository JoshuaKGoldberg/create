---
title: Addons
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

There will often be times when sets of block options would be useful to package together.
For example, many packages consuming an ESLint block might want to add on JSDoc linting rules.

Reusable generators for options will be available as addons.
Their produced options will then be merged together by `create` and then passed to blocks at runtime.

For example, a JSDoc linting addon for a rudimentary ESLint linting block with options for adding plugins:

```ts
import { blockESLint, BlockESLintOptions } from "@example/block-eslint";

export const addonESLintJSDoc = blockESLint.createAddon({
	produce(): AddonOutput<BlockESLintOptions> {
		return {
			options: {
				configs: [`jsdoc.configs["flat/recommended-typescript-error"]`],
				imports: [`import jsdoc from "eslint-plugin-jsdoc"`],
				rules: {
					"jsdoc/informative-docs": "error",
					"jsdoc/lines-before-block": "off",
				},
			},
		};
	},
});
```

Options produced by addons will be merged together by `...` spreading, both for arrays and objects.

The `create-testers` package will include testing utilities that provide mock data to an addon under test:

```ts
import { createMockAddonContext } from "create-testers";

import { addonESLintJSDoc } from "./addonESLintJSDoc";

describe("addonESLintJSDoc", () => {
	it("returns configs, imports, and rules", () => {
		const context = createMockAddonContext();

		const actual = await addonESLintJSDoc(context);

		expect(actual).toEqual({
			options: {
				configs: [`jsdoc.configs["flat/recommended-typescript-error"]`],
				imports: [`import jsdoc from "eslint-plugin-jsdoc"`],
				rules: {
					"jsdoc/informative-docs": "error",
					"jsdoc/lines-before-block": "off",
				},
			},
		});
	});
});
```
