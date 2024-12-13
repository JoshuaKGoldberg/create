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
   - `directory: string` (default: `'.'`): The root directory to write files to
   - `mode`: What [mode](#modes) to run in _(soon to be expanded)_

:::note
Runner APIs apply their generated objects to disk, as well as executing any network requests and shell commands.
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

## Modes

Runner APIs may be provided one of the following values for `mode`:

- `"create"`: Indicating the production is being used to create a new repository
- _(coming soon)_ `"initialize"`
- _(coming soon)_ `"migrate"`

### Mode `"create"`

The creation mode creates a new repository on GitHub.
After the production is run, including writing files on disk and running scripts, the `create` engine will:

1. Create a new repository on GitHub
   - If the Preset's Base defines a [`template`](../apis/creators#createbase-template), the repository will include a _generated from_ notice pointing to that template repository
2. Add that new repository as the `origin` remote
3. Force-push a single commit with the new repository contents to that origin
