---
title: Testing Addons
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Addon options will then be testable with the same mock context utilities as before:

```ts
import { createMockAddonContext } from "create-testers";

import { addonESLintPerfectionist } from "./addonESLintPerfectionist";

describe("addonESLintPerfectionist", () => {
	it("includes perfectionist/sort-objects configuration when options.partitionByComment is provided", () => {
		const context = createMockAddonContext({
			options: {
				partitionByComment: true,
			},
		});

		const actual = await addonESLintPerfectionist(context);

		expect(actual).toEqual({
			options: {
				configs: [`perfectionist.configs["recommended-natural"]`],
				imports: `import perfectionist from "eslint-plugin-perfectionist"`,
				rules: {
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
		});
	});
});
```
