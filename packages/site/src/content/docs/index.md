---
description: Composable, testable, type-safe templates. 💝
title: create
---

> Composable, testable, type-safe templates. 💝

`create` is a new scaffolding engine for describing repository templates.

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

## About

`create` lets you define templates for repositories.
It's like a modern version of [Yeoman](https://yeoman.io), but:

- **Composable**: Individual blocks in your templates can be mix-and-matched together
- **Testable**: Each layer of your templates can be individually unit or end-to-end tested
- **Type-Safe**: Fully typed from the ground up, including [Zod](https://zod.dev)-based options schemas

`create` also provides easy scaffolding to turn your template into a repository generator akin to a `create-next-app` or `create-typescript-app`.

:::tip[Getting Started]
See [CLI](./cli) to generate your first repository with the `create` command.
:::

## Details

The `create` engine combines the following layers:

1. **[Schemas](./concepts/schemas)**: Option types and default values that will be used to scaffold a repository
2. **[Blocks](./concepts/blocks)**: Generators for individual portions of a repository
3. **[Presets](./concepts/presets)**: Groups of Blocks that form a repository base
4. **[Templates](./concepts/templates)**: Groups of Presets that form a `create-*-app` project

The portions of `create` allow you to define the inputs to your repository generator, the individual pieces of the repository to be generated, and any preset configurations users can choose to start from.
`create` will then generate an interactive CLI and full documentation website for you.

## Status

`create` is _very_ early stage.
It is just barely past proof-of-concept stage.

At the moment, it's being developed as an MVP to replace the internals of [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
See [FAQs > How do I use `create`?](./faqs#how-do-i-use-create).
