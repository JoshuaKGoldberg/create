---
description: "How the engine produces Creations from Blocks at runtime."
title: Execution
---

The steps [`runPreset`](../apis/producers#producepreset) takes internally are:

1. Create a queue of Blocks to be run, starting with all defined in the Preset
2. For each Block in the queue:
   1. Get the Creation from the Block, passing any current known Addons
   2. Store that Block's Creation
   3. If a [runtime mode](#modes) is specified, additionally generate the approprate Block Creations
   4. If the Block specified new addons for any other Blocks:
      1. Add those Blocks to the queue of Blocks to re-run
3. Merge all Block Creations together

## Modes

The `create` engine can be told to run in one the following "modes":

- _(coming soon)_ `"initialize"`
- _(coming soon)_ `"migrate"`
- `"new"`: Indicating the production is being used to create a new repository

### `"new"`

This mode creates a new repository on GitHub.
As the production is run, including writing files on disk and running scripts, the `create` engine will:

1. Create a new repository on GitHub
   - If the Preset's Base defines a [`template`](../apis/creators#createbase-template), the repository will include a _generated from_ notice pointing to that template repository
2. Add that new repository as the `origin` remote
3. Force-push a single commit with the new repository contents to that origin