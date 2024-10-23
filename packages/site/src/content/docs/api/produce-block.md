---
title: produceBlock
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Given a [Block](../concepts/blocks) Factory, `produceBlock` runs the Block and produces a [Creation](../runtime/creations).

```ts
import { z } from "zod";

declare const schema: Schema<{ name: z.ZodString }>;

const blockFactory = schema.createBlock({
	// ...
});

const creation = await produceBlock(blockFactory);

console.log(creation);
```

## Arguments

1. `blockFactory` (required): a [Block](../concepts/blocks) Factory
2. `settings` (required): production settings that must provide the Block's full [Options](../concepts/blocks#options) and any [Args](../concepts/blocks#args)

### `options`

Any number of options defined by the Block's [Schema](../concepts/schemas).

For example, this Block is run with a `name` option:

```ts
import { BlockFactory } from "create";

declare const blockFactory: BlockFactory<{ name: string }>;

await produceBlock(blockFactory, {
	options: {
		name: "My Production",
	},
});
```

### `args`

Any number of args defined by the Block.

For example, this Block is run with a `prefix` arg:

```ts
import { BlockFactory } from "create";

declare const blockFactory: BlockFactory<{ name: string }, { prefix: string }>;

await produceBlock(blockFactory, {
	args: {
		prefix: "The",
	},
	options: {
		name: "My Production",
	},
});
```

## Return

`producePreset` returns a Promise for the Block's [`Creation`](../runtime/creations).
Both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations) will be present.
