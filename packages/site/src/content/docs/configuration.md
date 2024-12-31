---
description: "Configuring create from a config file."
title: Configuration
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.

**Configuration files are only partially implemented so far.**
:::

Running `npx create --preset ...` in a repository that was already set up with that Preset will re-run the Preset on the repository.
You can store CLI settings for `create` in a configuration file named `create.config.js` in the root of the repository.

It should `export default` a call to a `createConfig()` function that takes in a Preset.
`npx create` will pick up on that file and read any customizations to your Preset from it.

For example, keeping a repository up-to-date with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```ts title="create.config.js"
import { createConfig } from "create";
import { presetEverything } from "create-typescript-app";

export default createConfig(presetEverything);
```

Once that file is created, you can re-run `create`:

```shell
npx create
```

Running `npx create` in a repository with that `create.config.js` would be the equivalent of running `npx create typescript-app --preset everything`.

## `createConfig`

The exported `createConfig` function takes in up to two arguments:

1. _(required)_ A Preset imported from a package
2. _(optional)_ An object containing any customizations to be applied to the preset

The customizations that can be passed to `createConfig` are a superset of what you can pass on the CLI.

### `addons`

Any [Addons](./engine/concepts/blocks#addons) to be passed to the [Blocks](./engines/concepts/blocks) that come with the Preset.
These will be [merged](./engine/runtime/merging) in with Addons provided by other Blocks.

For example, this configuration file adds the word `"arethetypeswrong"` to a CSpell Block's Addons:

```ts title="create.config.js"
import { createConfig } from "create";
import { blockCSpell, presetEverything } from "create-typescript-app";

export default createConfig(presetEverything, {
	addons: [
		blockCSpell({
			words: ["arethetypeswrong"],
		}),
	],
});
```

Running `npx create` in a repository with that configuration file would merge in that `words` to the Addons provided to its CSpell Block.

### `blocks`

Any customizations to the [Blocks](./engines/concepts/blocks) provided as part of the Preset.

#### `add`

Any Blocks to add to what the Preset provides.

For example, this configuration file adds in an "arethetypeswrong" Block alongside existing Blocks provided by `create-typescript-app`:

```ts title="create.config.js"
import { createConfig } from "create";
import { blockAreTheTypesWrong, presetEverything } from "create-typescript-app";

export default createConfig(presetEverything, {
	blocks: {
		add: [blockAreTheTypesWrong],
	},
});
```

Running `npx create` in a repository with that configuration file would add in the created outputs from `blockAreTheTypesWrong`.

#### `remove`

Any Blocks to remove from what the Preset provides.

For example, this configuration file removes the default _"This package was templated with..."_ notice that comes with `create-typescript-app`:

```ts title="create.config.js"
import { createConfig } from "create";
import { blockTemplatedBy, presetEverything } from "create-typescript-app";

export default createConfig(presetEverything, {
	blocks: {
		remove: [blockTemplatedBy],
	},
});
```

Running `npx create` in a repository with that configuration file would not include that Block, and so its generated README.md would not include the notice.
