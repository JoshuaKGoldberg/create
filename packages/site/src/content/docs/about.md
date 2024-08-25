---
description: "About create: composable, testable, type-safe templates. 💝"
next:
  label: "Blocks"
  link: "blocks/about"
title: About
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

The `create` engine combines the following layers:

1. **[Blocks](./blocks/about)**: each tooling piece outputting files, network requests, and/or shell commands
   - **[Options](./blocks/options)**: schema-defined configuration settings
   - **[Metadata](./blocks/metadata)**: signals output from the block that can be used in other blocks
   - **[Migrations](./blocks/migrations)**: descriptions of how to clean up from previous versions
2. **[Inputs](./inputs/about)**: read in data from the creation context, allowing their own options
3. **[Addons](./addons/about)**: added options for a block, with their own inputs and options
4. **[Presets](./presets/about)**: configurable groups of blocks and addons, allowing their own options

On top of those sits `create`: the end-user runtime that receives all that info and creates or updates a repository.

## End Vision

`create` will be a general engine.
It won't have any specific blocks or _presets_ built-in.

Instead, external packages such as [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) will take on the responsibility of creating their own framework-/library-specific blocks and _presets_.

For example, a non-exhaustive list of `create-typescript-app` packages might contain:

<details>
<summary>Blocks</summary>

- `@create-typescript/block-all-contributors`
- `@create-typescript/block-compliance`
- `@create-typescript/block-contributing`
- `@create-typescript/block-cspell`
- `@create-typescript/block-eslint`
- `@create-typescript/block-github-alt-text`
- `@create-typescript/block-husky`
- `@create-typescript/block-knip`
- `@create-typescript/block-markdownlint`
- `@create-typescript/block-package-json`
- `@create-typescript/block-pnpm`
- `@create-typescript/block-prettier`
- `@create-typescript/block-license-mit`
- `@create-typescript/block-readme`
- `@create-typescript/block-release-it`
- `@create-typescript/block-renovate`
- `@create-typescript/block-tsc`
- `@create-typescript/block-tsup`
- `@create-typescript/block-vitest`

</details>

<details>
<summary>Addons</summary>

- `@create-typescript/addon-all-contributors-auto-action`
- `@create-typescript/addon-eslint-comments`
- `@create-typescript/addon-eslint-jsdoc`
- `@create-typescript/addon-eslint-jsonc`
- `@create-typescript/addon-eslint-eslint`
- `@create-typescript/addon-eslint-md`
- `@create-typescript/addon-eslint-regexp`
- `@create-typescript/addon-eslint-perfectionist`
- `@create-typescript/addon-eslint-vitest`
- `@create-typescript/addon-markdownlint-sentences-per-line`
- `@create-typescript/addon-pnpm-dedupe`
- `@create-typescript/addon-prettier-plugin-curly`
- `@create-typescript/addon-prettier-plugin-sh`
- `@create-typescript/addon-prettier-plugin-packagejson`
- `@create-typescript/addon-tsup-bin`
- `@create-typescript/addon-vitest-console-fail-test`
- `@create-typescript/addon-vitest-coverage`
</details>

<details>
<summary>Presets</summary>

- `@create-typescript/preset-minimal`
- `@create-typescript/preset-common`
- `@create-typescript/preset-everything`

</details>

The `create-typescript-app` _presets_ will be configurable with options to swap out pieces as needed for repositories.
For example, some repositories will want to swap out the Tsup block for a different builder.

Over time, `@create-typescript` will encompass all common TypeScript package types from repositories I (Josh) use.
That will include browser extensions, GitHub actions, and web frameworks such as Astro.
