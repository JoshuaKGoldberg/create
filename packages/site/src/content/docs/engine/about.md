---
description: How the create engine works.
title: About
---

The `create` engine combines the following layers:

1. **[Schemas](./concepts/schemas)**: Option types and default values that will be used to scaffold a repository
2. **[Blocks](./concepts/blocks)**: Generators for individual portions of a repository
3. **[Presets](./concepts/presets)**: Groups of Blocks that form a repository base
4. **[Templates](./concepts/templates)**: Groups of Presets that form a `create-*-app` project

The portions of `create` allow you to define the inputs to your repository generator, the individual pieces of the repository to be generated, and any preset configurations users can choose to start from.
`create` will then generate an interactive CLI and full documentation website for you.
