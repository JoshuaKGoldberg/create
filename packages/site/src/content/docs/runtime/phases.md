---
description: "The pieces of a repository as described by a Block."
title: Phases
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

By default, blocks run in the order specified in their [Preset](../concepts/presets).
However, some blocks may need to refer to the [Indirect Creations](./creations#indirect-creations) produced by earlier blocks.

Blocks may specify a `phase` property in their definition using a `BlockPhase` enum.
Doing so indicates when that Block should be run relative to other blocks.

Those `BlockPhase` phases are:

0. `Default`
1. `Install`
2. `Source`
3. `Test`
4. `Build`
5. `Format`
6. `Lint`
7. `Package`
8. `Documentation`
9. `Git`
10. `Editor`
11. `CI`

For example, the following `blockTests` Block indicates it should be run during the `Test` phase, so it can read metadata created by Blocks in earlier phases:

```ts
import { BlockPhase, MetadataFileType } from "create";

import { schema } from "../schema.js";

export const blockTests = schema.createBlock({
	about: {
		name: "Tests",
	},
	phase: BlockPhase.Test,
	produce({ created }) {
		return {
			files: {
				".mocharc.json": JSON.stringify({
					spec: created.metadata
						.filter((value) => value.type === MetadataFileType.Source)
						.map((value) => value.glob),
				}),
			},
		};
	},
});
```

See [Creations > Indirect Creations](../runtime/creations#indirect-creations) for the values Blocks can read from Blocks run in earlier phases.
