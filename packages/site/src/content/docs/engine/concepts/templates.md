---
description: "Groups of presets that a user can choose between."
title: Templates
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

A _Template_ defines a group of [Presets](./presets) that can be chosen between by a user.

Templates are the highest level of grouping in `create` projects.
CLI APIs like `npx create *-app` will work by pointing to a Template and asking the user to choose between their presets.

For example, this Template groups several levels of tooling from a `create-typescript-app`-like generator:

```ts
import { createTemplate } from "create";

import { presetCommon } from "./presetCommon";
import { presetEverything } from "./presetEverything";
import { presetMinimal } from "./presetMinimal";

export const templateTypeScriptApp = createTemplate({
	about: {
		name: "TypeScript App",
	},
	default: "common",
	presets: [
		{ label: "minimal", preset: presetMinimal },
		{ label: "common", preset: presetCommon },
		{ label: "everything", preset: presetEverything },
	],
});
```

A [CLI](../../cli) like `npx create` can then work with that Template to prompt the user for choosing a Preset:

```bash
$ npx create typescript-app

┌ Let us ✨ create ✨ a TypeScript App repository!
│
◆ Which Preset would you like to start with?
│ ○ minimal
│ ● common
│ ○ everything
└
```

:::note
The Presets used in a Template don't need to all be from the same shared [Base](./bases).
This allows more comprehensive Presets to come with a larger set of required Options.
:::
