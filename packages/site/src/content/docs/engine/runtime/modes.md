---
description: "Different runtime modes the engine can be targeted to."
title: Modes
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The `create` engine can be told to run in one the following "modes":

- _(coming soon)_ `"initialize"`
- _(coming soon)_ `"migrate"`
- `"new"`: Indicating the production is being used to create a new repository

## `"new"`

This mode creates a new repository on GitHub.
As the production is run, including writing files on disk and running scripts, the `create` engine will:

1. Create a new repository on GitHub
   - If the Preset's Base defines a [`template`](../apis/creators#createbase-template), the repository will include a _generated from_ notice pointing to that template repository
2. Add that new repository as the `origin` remote
3. Force-push a single commit with the new repository contents to that origin
