---
title: Presets
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Users won't want to manually configure blocks and addons in all of their projects. Presets that configure broadly used or organization-wide configurations will help share setups.

For example, a preset that configures ESLint, README.md with logo, and Vitest blocks with JSONC linting, JSDoc linting, and test linting addons:

```ts
import { createPreset } from "@create-/preset";
import { blockESLint } from "@example/block-eslint";
import { blockReadme } from "@example/block-readme";
import { blockVitest } from "@example/block-vitest";

export const myPreset = createPreset({
	produce() {
		return [
			blockESLint({
				addons: [addonESLintJSDoc(), addonESLintJSONC(), addonESLintVitest()],
			}),
			blockReadme({
				logo: "./docs/my-logo.png",
			}),
			blockVitest(),
		];
	},
});
```
