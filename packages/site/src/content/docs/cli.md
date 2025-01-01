---
description: "Running create on your command line."
title: CLI
---

The `create` CLI is what you run to generate a new repository or migrate an existing one.
It will interactively prompt you for any options it needs to run that can't be inferred from disk.

```shell
npx create
```

## Modes

The `create` CLI will automatically detect which [`-m`/`--mode`](#-m----mode) it is being run in:

- [Initialization](#initialization-mode): Creating a new repository from a template
- [Migration](#migration-mode): Updating an existing repositories to a new version of a template

### Initialization Mode

Creates a new repository from a template.
This mode will be used by default if the current directory is empty.

For example, to generate a new repository using [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app
```

```plaintext
┌  ✨ create ✨
│
│  Welcome to create: a delightful repository templating engine.
│
│  Learn more about create on:
│    https://create.bingo
│
│  Running with mode --create for a new repository using the template:
│    create-typescript-app
|
```

### Migration Mode

Updates an existing repository to a new version of a template.
This mode will be used by default if the current directory is a Git repository and/or contains a [`create.config.*` configuration file](./configuration).

For example, to update an existing repository to the latest [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app
```

```plaintext
┌  ✨ create ✨
│
│  Welcome to create: a delightful repository templating engine.
│
│  Learn more about create on:
│    https://create.bingo
│
│  Running with mode --create for an existing repository using the template:
│    create-typescript-app
|
```

## Flags

:::note
The `create` CLI is a general runner to pull in information from templates.
See the documentation for your specific template for additional flags.
:::

The first argument passed to `create` can be a shorthand [`-f` / `--from`](#-f----from) for an npm package default-exporting a [Template](./concepts/templates).
A shorthand name excludes the `create-` prefix to an npm package name that starts with `create-`.

### `-d` / `--directory`

> Type: `string`

What local directory path to run under.

If not provided:

- If the current directory is empty, defaults to it (`.`)
- Otherwise, you'll be prompted to input one

For example, creating a new repository in a subdirectory:

```shell
npx create typescript-app --directory my-fancy-project
```

### `-f` / `--from`

> Type: `string`

An explicit path to import a template from.

This can be either:

- A full npm package name, such as `create-typescript-app`
  - Use this if you'd like to specify a package name that doesn't begin with `create-`
- A relative path to import from: such as `npx create --from ./path/to/repository`

For example, using an org-scoped package:

```shell
npx create --from @joshuakgoldberg/my-fancy-template
```

### `-h` / `--help`

> Type: `boolean`

Prints help text.

```shell
npx create --help
```

### `-m` / `--mode`

> Type: `string`

Which [mode](#modes) to run in.

If not provided, it will be inferred based on whether `create` is being run in an existing repository.

For example, specifying creating a new repository with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app --mode initialize
```

### `-p` / `--preset`

> Type: `string`

Which [Preset](./concepts/presets) to use from the template.

If not provided, and the template defines multiple Presets, `create` will prompt the user to select one.

For example, specifying the _common_ preset for [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app --preset common
```

### `-v` / `--version`

> Type: `boolean`

Prints the `create` package version.

```shell
npx create --version
```

### Template Options

The template being generated from may add in additional flags.

For example, if a template's Base defines a `title` option, `--title` will be type `string`:

```shell
npx create typescript-app --title "My New App"
```

Any required options that are not provided will be prompted for by the `create` CLI.
