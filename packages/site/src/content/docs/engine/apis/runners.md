---
title: Runner APIs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Runner APIs can be used to execute and apply [Creations](../runtime/creations) on disk:

- [`runBlock`](#runblock): applies a [Block](../concepts/blocks) production
- [`runPreset`](#runpreset): applies a [Preset](../concepts/presets) production

Each runner API takes in up to two arguments:

1. The construct to be run
2. An object with properties from the construct's context as well as [System contexts](../runtime/contexts#system-contexts) and:
   - `rootDirectory: string` (default: `'.'`): The root directory to write files to

:::note
Runner APIs apply their generated objects to disk.
For APIs that only create those objects in memory, see [Producers](./producers).
:::

## `runBlock`

Given a [Block](../concepts/blocks), executes a [Creation](../runtime/creations) output by running its [`produce()`](../concepts/blocks#production).

For example, given a Block that creates a `README.md`, this would write that file to system:

```ts
import { runBlock } from "create";
import { blockReadme } from "./blockReadme.js";

await runBlock(blockReadme);
```

## `runPreset`

Given a [Preset](../concepts/presets), executes a [Creation](../runtime/creations) output by running each of its Blocks [`produce()`](../concepts/blocks#production).

For example, given a Preset containing the previous Block that creates a `README.md`, this would write that file to system:

```ts
import { runBlock } from "create";
import { presetWithReadme } from "./presetWithReadme.js";

await runPreset(presetWithReadme);
```
