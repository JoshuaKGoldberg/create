---
description: "The pieces of a repository as described by Blocks."
title: Creations
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

A Creation object is what's returned by each [Block](../about/blocks)'s `produce()` method.
It may contain any of the following properties:

- ["Direct" creations](#direct-creations) that always cause changes to the repository:
  - [`commands`](#commands): Terminal commands to run after setup
  - [`files`](#files): Files to create or modify on disk
  - Network requests _(to be added soon)_
- ["Indirect" creations](#indirect-creations) only made to be used by later blocks:
  - [`addons`](#addons): Composed Args to merge in for other Blocks, if they exist

For example, a Block that adds pnpm package deduplication might choose to both run a command ([`commands`](#commands)) used in a GitHub Actions job in [addon Args](#addons) to another Block:

```ts
import { base } from "./base";

export const blockPnpmDeduplicate = base.createBlock({
	async produce() {
		return {
			args: [
				blockGitHubActions({
					jobs: [
						{
							name: "Lint Packages",
							steps: [{ run: "pnpm lint:packages" }],
						},
					],
				}),
			],
			commands: ["pnpm dedupe"],
		};
	},
});
```

## Direct Creations

These Creation properties always cause changes to the output repository.

### `commands`

Terminal commands to run after setup.

This can be useful when commands are necessary to initialize a repository after files are written.

For example, an AllContributors block that runs a hydration command:

```ts
import { base } from "../base";

export const blockKnip = base.createBlock({
	produce() {
		return {
			commands: ["npx all-contributors-cli generate"],
		};
	},
});
```

### `files`

Files to create or modify on disk.

This is the primary, most common output from blocks.
Each object under `files` describes a folder of files.
Properties whose values are strings are written as files on disk.
Properties whose values are objects represent a directory.

For example, a block that generates a `.github/CODE_OF_CONDUCT.md` file:

```ts
import { base } from "../base";

export const blockContributorCovenant = base.createBlock({
	produce() {
		return {
			files: {
				".github": {
					"CODE_OF_CONDUCT.md": `# Contributor Covenant Code of Conduct \n ...`,
				},
			},
		};
	},
});
```

That would instruct the `create` engine to create a `.github/` directory if it doesn't exist yet, then create a `.github/CODE_OF_CONDUCT.md` file.

## Indirect Creations

These Creation properties produce information meant to be used by subsequent Blocks.

See [Context](./contexts) for how Blocks can read context from previous Blocks.

### `addons`

Additional [Args](../concepts/blocks#args) to merge in for other Blocks, if those Blocks exist.

Blocks may specify additions to other, "downstream" Blocks.
If the downstream Block is included in the running Preset, then the augmenting Args will be merged into what that downstream Block receives.

For example, this `blockESLintJSDoc` Block tells `blockESLint` about using the ESLint plugin for JSONC files:

```ts
import { base } from "./base";
import { blockESLint } from "./blockESLint";

export const blockESLintJSDoc = base.createBlock({
	produce() {
		return {
			args: [
				blockESLint({
					extensions: ['...jsonc.configs["flat/recommended-with-json"]'],
					imports: [{ source: "eslint-plugin-jsonc", specifier: "jsonc" }],
				}),
			],
		};
	},
});
```

If `blockESLint` is run in the same Preset, then it will receive those additional Args.
