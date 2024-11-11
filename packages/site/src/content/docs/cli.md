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

The first argument passed to `create` should be a path to a [Template](./concepts/templates).
That Template is what `create` will scaffold a repository from ([`-f` / `--from`](#-f----from)).

The "from" path can be:

- "Shorthand" for an npm package: its name excluding a `create-` prefix, such as `npx create typescript-app` for the [`create-typescript-app` package](https://www.npmjs.com/package/create-typescript-app)
- A relative path to import from: such as `npx create ./path/to/index.js`

:::tip
See the documentation for the individual Template you're generating from for additional arguments.
:::

### `-f` / `--from`

An explicit path to import the Template from.
Use this if you'd like to specify a package name that doesn't begin with `create-`.

For example, using an org-scoped package:

```shell
npx create --from @joshuakgoldberg/my-fancy-template
```

### `-p` / `--preset`

Which [Preset](./concepts/presets) to use from the Template.

If not provided, and the Template defines multiple Presets, `create` will prompt the user to select one.

For example, specifying the _common_ preset for [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app):

```shell
npx create typescript-app --preset common
```

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
