---
description: "About create: composable, testable, type-safe templates. 💝"
next:
  label: "Blocks"
  link: "blocks/about"
title: About
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

## End Vision

`create` will be a general engine.
It won't have any specific blocks or presets built-in.

Instead, external packages such as [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) will take on the responsibility of creating their own framework-/library-specific blocks and presets.

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

The `create-typescript-app` presets will be configurable with options to swap out pieces as needed for repositories.
For example, some repositories will want to swap out the Tsup block for a different builder.

Over time, `@create-typescript` will encompass all common TypeScript package types from repositories I (Josh) use.
That will include browser extensions, GitHub actions, and web frameworks such as Astro.
