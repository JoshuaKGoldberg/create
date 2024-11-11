---
description: "Running create on your command line."
title: CLI
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.

**This CLI has not been implemented yet.**
:::

The `create` CLI is what you run to generate a new repository.
It takes in a Template, such as the name of a `create-*` package on npm, and prompts you to fill in any details.

For example, to generate a new repository using [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app
```

```plaintext
┌ Let us ✨ create ✨ a TypeScript App repository!
│
◆ Which Preset would you like to start with?
│ ○ minimal
│ ● common
│ ○ everything
└
```

:::note
The `create` CLI is just a general runner to pull in information from Templates.
See the individual
:::

## Arguments

The first argument passed to `create` can be a shorthand [`-f` / `--from`](#-f----from) for an npm package default-exporting a [Template](./concepts/templates).
A shorthand name excludes the `create-` prefix to an npm package name that starts with `create-`.

:::tip
See the documentation for the individual Template you're generating from for additional arguments.
:::

For example, using [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app
```

### `-d` / `--directory`

> Type: `string`

What local directory path to create the new repository under.

If not provided:

- If the current directory is empty, defaults to it (`.`)
- Otherwise, `create` will prompt the user to input one

For example, creating a new repository in a subdirectory:

```shell
npx create typescript-app --directory my-fancy-project
```

### `-f` / `--from`

> Type: `string`

An explicit path to import the Template from.

This can be either:

- A full npm package name, such as `create-typescript-app`
  - Use this if you'd like to specify a package name that doesn't begin with `create-`.
- A relative path to import from: such as `npx create ./path/to/repository`

For example, using an org-scoped package:

```shell
npx create --from @joshuakgoldberg/my-fancy-template
```

### `-p` / `--preset`

> Type: `string`

Which [Preset](./concepts/presets) to use from the Template.

If not provided, and the Template defines multiple Presets, `create` will prompt the user to select one.

For example, specifying the _common_ preset for [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app --preset common
```

### `-w` / `--watch`

> Type: `boolean`

:::danger
**This will be very experimental** and targeted to developers writing their own repository templates.
:::

Whether to keep `create` running in a "watch" mode after its initial pass.
When in watch mode, `create` will re-apply file creations whenever the "from" file or any of its imported entries change.
This is only supported when the "from" is a relative path to a local ESM entry point on disk.

For example, using a sibling `create-typescript-app` directory's package entry point to create a new repository under a child `generated/` directory:

```shell
npx create --directory generated --from ../create-typescript-app --watch
```

Running in watch mode is useful if you're working on your own repository template and want to preview changes locally.

Watch mode assumes that another tool will be running to recreate the "from" entry point file.

For example, with the previous `--watch` command, it would be reasonable to run the build script in its own watch mode in the sibling `../create-typescript-app` directory:

```shell
# ../create-typescript-app
pnpm build -- --watch
```

:::tip
Watch mode only reruns when a file that is statically imported by the "from" entry point changes.
Detection is done by [precinct](https://www.npmjs.com/package/precinct).
If your file changes aren't statically detectable, you can always manually save the "from" file.
:::

### Schema Arguments

The Template being generated from will add in additional arguments based on its [Schema](./concepts/schemas).
Arguments defined in a Template's Schema can be provided to `create` after a `--`.
Their name will be the lowercase name of the defined option.

For example, if a Template's Schema defines a `title: z.string()` option, `--title` will be type `string`:

```shell
npx create typescript-app --preset everything -- --title "My New App"
```

Any required Schema arguments that are not provided will be prompted for by the `create` CLI.

### Skipping Blocks

Most of the time, you shouldn't need to customize a Template beyond the options defined by its [Schema](./concepts/schemas).
However, it can sometimes be desirable to skip producing some pieces of tooling for individual projects.

The `create` CLI automatically adds in boolean `--skip-*` arguments that can omit specific named [Blocks](./concepts/blocks).
Those arguments use the lowercase name of the block for the `*`.

For example, to use `create-typescript-app`'s _everything_ preset and omit its Markdownlint block:

```shell
npx create typescript-app --preset everything --skip-markdownlint
```
