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
  - [`package`](#package): Entries to add to the `package.json` file
  - Network requests _(to be added soon)_
- ["Indirect" creations](#indirect-creations) only made to be used by later blocks:
  - [`addons`](#addons): Composed Args to merge in for other Blocks, if they exist
    <!-- - [`documentation`](#documentation): Descriptions of how users should use the tooling -->
    <!-- - [`editor`](#editor): Settings to configure the user's editor or IDE -->
    <!-- - [`jobs`](#jobs): CI jobs to be run in an environment such as GitHub Actions -->
  - [`metadata`](#metadata): Descriptions for classifications of files, matched by glob

For example, a Block that adds pnpm package deduplication might choose to both run a command ([`commands`](#commands)) as well as add a `package.json` script ([`package`](#package)) used in a GitHub Actions job in [augmented Args](#args) to another Block:

```ts
import { schema } from "./schema";

export const blockPnpmDeduplicate = schema.createBlock({
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
			package: {
				scripts: {
					"lint:packages": "pnpm dedupe --check",
				},
			},
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
import { schema } from "../schema";

export const blockKnip = schema.createBlock({
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
import { schema } from "../schema";

export const blockContributorCovenant = schema.createBlock({
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

:::note
Specifying a `files['package.json']` is not permitted, as that file is managed by the [`package`](#package) property.
:::

## Indirect Creations

These Creation properties produce information meant to be used by subsequent Blocks.

- See [Context](./contexts) for how Blocks can read context from previous Blocks.
- See [Phases](./phases) for the Phases of execution Blocks can specify.

### `addons`

Additional [Args](../concepts/blocks#args) to merge in for other Blocks, if those Blocks exist.

Blocks may specify additions to other, "downstream" Blocks.
If the downstream Block is included in the running Preset, then the augmenting Args will be merged into what that downstream Block receives.

For example, this `blockESLintJSDoc` Block Factory explicitly indicates it should run before `blockESLint`, so that it may provide Args to `blockESLint`:

```ts
import { blockESLint } from "./blockESLint";
import { schema } from "./schema";

export const blockESLintJSDoc = schema.createBlock({
	phase: blockESLint,
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

### `metadata`

TODO: Mention generically brought in by schema
