---
description: "The pieces of a repository as described by Blocks."
title: Creations
---

A Creation object is what's returned by each [Block](../about/blocks)'s `produce()` method.
It may contain any of the following properties:

- ["Direct" creations](#direct-creations) that always cause changes to the repository:
  - [`files`](#files): Files to create or modify on disk
  - [`requests`](#requests): Network requests to send after files are created
  - [`scripts`](#scripts): Terminal commands to run after files are created
- ["Indirect" creations](#indirect-creations) only made to be used by later blocks:
  - [`addons`](#addons): Composed Addons to merge in for other Blocks, if they exist
  - [`suggestions`](#suggestions): Tips for the next steps to take

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

### `requests`

Network requests to send after files are created.

This can be useful when repository settings or other APIs are necessary to align the created repository to what Blocks have produced.

Each request may be specified as an object with:

- `id` (`string`): Unique ID to know how to deduplicate previous creations during [merging](./merging#requests)
- `send` (function): Asynchronous method that sends the request, which receives an object parameter containing:
  - `fetcher`: Equivalent to the global `fetch`
  - `octokit`: [GitHub Octokit](https://github.com/octokit/octokit.js?tab=readme-ov-file#octokit-api-client) that uses the `fetcher` internally

For example, this Block sets a GitHub repository's default branch to `main`:

```ts
import { base } from "../base";

export const blockDefaultBranch = base.createBlock({
	produce({ options }) {
		return {
			requests: [
				{
					id: "default-branch",
					async send({ octokit }) {
						await octokit.rest.repos.update({
							default_branch: "main",
							owner: options.owner,
							repo: options.repository,
						});
					},
				},
			],
		};
	},
});
```

### `scripts`

Terminal commands to run after files are created.

This can be useful when shell scripts are necessary to apply changes to the repository to align the created repository to what Blocks have produced.

Each script may be specified as either a string or an object with:

- `commands` (`string[]`): Shell scripts to run within the phase, in order
- `phase` (`number`): What order, relative to any other command groups, to run in

Commands provided as strings are assumed to not be order-dependent.
They are run all at the same time.

For example, this Block runs pnpm package installation:

```ts
import { base } from "../base";

export const blockPnpmInstall = base.createBlock({
	produce() {
		return {
			scripts: "pnpm install",
		};
	},
});
```

For example, this Block runs pnpm package installation and duplication in series within a first phase:

```ts
import { base } from "../base";

export const blockPnpmInstallAndDedupe = base.createBlock({
	produce() {
		return {
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

Those two Blocks with phase-dependent script commands together would run the following commands in order:

1. `pnpm install`
2. `pnpm dedupe`
3. `pnpm format --write`

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

### `suggestions`

Tips for the next steps to take.

Some Blocks require additional setup that users will have to take action on.
These will be logged to users after running `npx create`.

For example, this `blockNpmPublish` Block directs the user to create an automation token:

```ts
import { base } from "./base";
import { blockESLint } from "./blockESLint";

export const blockNpmPublish = base.createBlock({
	produce() {
		return {
			suggestions: [
				"Set an NPM_TOKEN secret to an npm access token with automation permissions",
			],
		};
	},
});
```

:::tip
These should be used only if a setup step can't be automated with a [`request`](#requests) or [`script`](#scripts).
:::
