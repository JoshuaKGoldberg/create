---
description: Composable, testable, type-safe templates. 💝
title: create
---

> Composable, testable, type-safe templates. 💝

`create` is a new scaffolding engine for describing repository templates.

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

The `create` engine combines the following layers:

1. **[Schemas](./concepts/schemas)**: Option types and default values that will be used to scaffold a repository
2. **[Blocks](./concepts/blocks)**: Generators for individual portions of a repository
3. **[Inputs](./concepts/inputs)**: Standalone functions to read in dynamic data
4. **[Presets](./concepts/presets)**: Groups of blocks that form a repository base

Put together, `create` allows defining a repository generator akin to a `create-next-app` or `create-typescript-app`.
The portions of `create` allow you to define the inputs to your repository generator, the individual pieces of the repository to be generated, and any preset configurations users can choose to start from.
`create` will then generate an interactive CLI and full documentation website for you.
