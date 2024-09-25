---
description: "Groups of presets that a user can choose between."
title: Templates
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

A _Template_ defines a group of [Presets](./presets) that can be chosen between by a user.

For example, this Template groups several levels of tooling from a `create-typescript-app`-like generator:

```ts
import { createTemplate } from "create";

export const templateTypeScriptApp = createTemplate({
	about: {
		name: "TypeScript",
	},
	presets: {
		common: presetCommon,
		everything: presetEverything,
		minimal: presetMinimal,
		recommended: presetRecommended,
	},
});
```
