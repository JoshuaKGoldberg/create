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

`create` is a repository template engine.
It's like a modern version of [Yeoman](https://yeoman.io), but:

- **Composable**: Individual blocks in your templates can be mix-and-matched together
- **Testable**: Each layer of your templates can be individually unit or end-to-end tested
- **Type-Safe**: Fully typed from the ground up, including [Zod](https://zod.dev)-based options schemas

`create` also provides scaffolding to turn templates into a repository generator akin to a `create-next-app` or `create-typescript-app`.

:::tip[Getting Started]
See [CLI](./cli) to generate your first repository from a template with the `create` command.
:::

## Status

`create` is _very_ early stage.
It is just barely past proof-of-concept stage.

At the moment, it's being developed as an MVP to replace the internals of [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
See [FAQs > How do I use `create`?](./faqs#how-do-i-use-create).
