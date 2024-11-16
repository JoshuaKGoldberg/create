---
title: Presets
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Users won't want to manually configure blocks in all of their projects.
Presets that configure broadly used or organization-wide configurations will help share setups.

For example, a preset that configures ESLint, README.md with a logo, and blocks with JSDoc and Vitest linting addons:

```ts
import { blockESLint } from "@example/block-eslint";
import { blockReadme } from "@example/block-readme";
import { blockVitest } from "@example/block-vitest";
import { addonESLintJSDoc, addonESLintVitest } from "@example/my-eslint-addons";

import { base } from "./base";

export const myPreset = base.createPreset({
	produce() {
		return [
			blockESLint({
				addons: [addonESLintJSDoc(), addonESLintVitest()],
			}),
			blockReadme({
				logo: "./docs/my-logo.png",
			}),
			blockVitest(),
		];
	},
});
```
