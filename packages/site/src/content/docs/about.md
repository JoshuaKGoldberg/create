---
description: "About create: delightful templating for web repositories."
title: About
---

`create` is a repository templating engine.
It allows developers to create reusable templates that describe the files and settings for projects, as well as configurable, type-safe options for customizations.

`create` also provides tooling to work with those templates:

- **Initialization**: Creating new repositories from templates with a single CLI command.
- **Migration**: Updating existing repositories to the newest versions of their template.

:::tip[Getting Started]
See [CLI](./cli) to generate your first repository from a template with the `create` command.
:::

## Why?

Keeping up to date with the latest and greatest in web development tooling is _hard_:

1. Configuring all sorts of useful tools from scratch takes a lot of time and effort.
2. As tools change, rolling out improvements to all your repositories is even more time and effort.

`create` helps with both of those problems.

It allows you to pull in great tooling from templates such as [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) -- without needing to configure it all from scratch.
Templates can define both the raw files on disk as well as GitHub repository settings.

`create` additionally includes great support for updating your repositories as templates change.
Existing template options are inferred from your existing repository.
Rich persistent customizations can be defined in a configuration file.

Put together, `create` is a one-stop-shop for keeping one or many repositories on the latest and greatest in web development tooling.

## Status

`create` is _very_ early stage.
It is just barely past proof-of-concept stage.

At the moment, it's being developed as an MVP to generalize the internals of [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app).
See [FAQs > How do I use `create`?](./faqs#how-do-i-use-create).
