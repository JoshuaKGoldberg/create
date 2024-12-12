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
  - [`files`](#files): Files to create or modify on disk
  - [`scripts`](#scripts): Terminal commands to run after setup
  - Network requests _(to be added soon)_
- ["Indirect" creations](#indirect-creations) only made to be used by later blocks:
  - [`addons`](#addons): Composed Addons to merge in for other Blocks, if they exist

For example, a Block that adds pnpm package deduplication might choose to both run a script ([`scripts`](#scripts)) used in a GitHub Actions job in [Addons](#addons) to another Block:

```ts
import { base } from "./base";

export const blockPnpmDeduplicate = base.createBlock({
	async produce() {
		return {
			addons: [
				blockGitHubActions({
					jobs: [
						{
							name: "Lint Packages",
							steps: [{ run: "pnpm lint:packages" }],
						},
					],
				}),
			],
			scripts: ["pnpm dedupe"],
		};
	},
});
```

## Direct Creations

These Creation properties always cause changes to the output repository.

### `files`

Files to create or modify on disk.

This is the primary, most common output from blocks.
Each object under `files` describes a folder of files.
Properties whose values are strings are written as files on disk.
Properties whose values are objects represent a directory.

For example, this Block that generates a `.github/CODE_OF_CONDUCT.md` file:

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

#### File Creations

Each property in a `files` object may be one of the following:

- `false` or `undefined`: Ignored
- `object`: A directory, whose properties recursively are file creations
- `string`: A file to be created
- `[string, CreatedFileOptions]`: A file to be created with [`fsPromises.writeFile` options](https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options):
  - `mode`: Integer mode, such as `0o777` to make executable

For example, this Block generates an executable `.husky/pre-commit` file:

```ts
import { base } from "../base";

export const blockPreCommit = base.createBlock({
	produce() {
		return {
			".husky": {
				"pre-commit": ["npx lint-staged\n", { mode: 0o777 }],
			},
		};
	},
});
```

### `scripts`

Terminal commands to run after production.

Scripts will be run after files are applied to the system.
This can be useful when shell scripts are necessary to apply changes the Block enforces in CI.

Each command must be specified as an object with:

- `commands` (`string[]`): Shell scripts to run within the phase, in order
- `phase` (`number`): What order, relative to any other command groups, to run in

For example, this Block runs pnpm package installation and duplication in a first phase:

```ts
import { base } from "../base";

export const blockPnpmInstalls = base.createBlock({
	produce() {
		return {
			// ...
			scripts: [
				{
					phase: 0,
					scripts: ["pnpm install", "pnpm dedupe"],
				},
			],
		};
	},
});
```

A Prettier block might opt to run formatting in a subsequent phase, once any dependencies are done resolving:

```ts
import { base } from "../base";

export const blockPrettier = base.createBlock({
	produce() {
		return {
			// ...
			scripts: [
				{
					phase: 1,
					commands: ["pnpm format --write"],
				},
			],
		};
	},
});
```

Those blocks together would run the following commands in order:

1. `pnpm install`
1. `pnpm dedupe`
1. `pnpm format --write`

If multiple command groups specify the same `phase`, then they will start executing their scripts at the same time.
The next phase will not be started until all scripts in that phase complete.

For example, given the following production of scripts:

```ts
[
	{ commands: ["a", "b"], phase: 0 },
	{ commands: ["c", "d"], phase: 1 },
	{ commands: ["e", "f"], phase: 1 },
	{ commands: ["g"], phase: 2 },
];
```

Those commands would be run in the following order:

1. `a`
2. `b`
3. `c` and `e`
   - `d` _(after `c` completes)_
   - `f` _(after `e` completes)_
4. `g` _(after `d` and `f` complete)_

## Indirect Creations

These Creation properties produce information meant to be used by subsequent Blocks.

See [Context](./contexts) for how Blocks can read context from previous Blocks.

### `addons`

Additional [Addons](../concepts/blocks#addons) to merge in for other Blocks, if those Blocks exist.

Blocks may specify additions to other, "downstream" Blocks.
If the downstream Block is included in the running Preset, then the augmenting Addons will be merged into what that downstream Block receives.

For example, this `blockESLintJSDoc` Block tells `blockESLint` about using the ESLint plugin for JSONC files:

```ts
import { base } from "./base";
import { blockESLint } from "./blockESLint";

export const blockESLintJSDoc = base.createBlock({
	produce() {
		return {
			addons: [
				blockESLint({
					extensions: ['...jsonc.configs["flat/recommended-with-json"]'],
					imports: [{ source: "eslint-plugin-jsonc", specifier: "jsonc" }],
				}),
			],
		};
	},
});
```

If `blockESLint` is run in the same Preset, then it will receive those additional Addons.
