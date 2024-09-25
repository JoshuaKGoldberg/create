---
description: "The pieces of a repository as described by Blocks."
title: Creations
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

A Creation object is what's returned by each [Block](../about/blocks)'s `produce()` method.
It may contain any of the following properties:

- ["Direct" creations](#direct-creations) that always cause changes to the repository:
  - [`commands`](#commands): Terminal commands to run after setup
  - [`files`](#files): Files to create or modify on disk
  - [`package`](#package): Entries to add to the `package.json` file
  - Network requests _(to be added soon)_
- ["Indirect" creations](#indirect-creations) only made to be used by later blocks:
  - [`documentation`](#documentation): Descriptions of how users should use the tooling
  - [`editor`](#editor): Settings to configure the user's editor or IDE
  - [`jobs`](#jobs): CI jobs to be run in an environment such as GitHub Actions
  - [`metadata`](#metadata): Descriptions of what files, matched by glob

For example, a block that adds pnpm package deduplication might choose to both run a command ([`commands`](#commands)) as well as add a `package.json` script ([`package`](#package)) used in a CI job ([`jobs`](#jobs)):

```ts
import { schema } from "./schema";

export const blockPnpmDeduplicate = schema.createBlock({
	async produce() {
		return {
			commands: ["pnpm dedupe"],
			jobs: [
				{
					name: "Lint Packages",
					steps: [{ run: "pnpm lint:packages" }],
				},
			],
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

### `package`

Entries to add to the `package.json`.

These will be deduplicated based on version ranges by the `create` engine.
For example, if two blocks specify in a `package.devDependencies` object:

- `"typescript": ">=5`
- `"typescript": "^5.6.0`

...then `create` will know to stick with `typescript@5.6.0`.

For example, a block that adds Knip as a devDependency and a script:

```ts
import { schema } from "./schema";

export const blockKnip = schema.createBlock({
	produce() {
		return {
			package: {
				devDependencies: {
					knip: "5.27.2",
				},
				scripts: {
					"lint:knip": "knip",
				},
			},
		};
	},
});
```

The `create` engine would create a `package.json` file with the `devDependencies` and `scripts` specified by the block.
It would also install any package dependencies listed in the file.

## Indirect Creations

These Creation properties produce information meant to be used by subsequent Blocks.

- See [Context](./contexts) for how Blocks can read context from previous Blocks.
- See [Phases](./phases) for the Phases of execution Blocks can specify.

### `documentation`

Descriptions of how users should use the tooling.

Individual repositories generally put documentation in Markdown files such as their root `README.md` or a `.github/DEVELOPMENT.md`.
Blocks can suggest text to be added to those docs files.

For example, a documentation block that includes a repository's suggested steps for debugging:

```ts
import { schema } from "./schema";

export const block = schema.createBlock({
	produce() {
		return {
			documentation: {
				Debugging: `Here are some steps to debug the app... \n...`,
			},
		};
	},
});
```

### `editor`

Settings to configure the user's editor or IDE.

These will typically become editor configuration files later in the repository.

```ts
import { BlockPhase } from "create";

import { schema } from "../schema";

export const blockVSCode = schema.createBlock({
	phase: BlockPhase.Editor,
	produce({ created }) {
		return {
			files: {
				".vscode": {
					"extensions.json": JSON.stringify({
						recommendations: created.editor.extensions,
					}),
				},
			},
		};
	},
});
```

### `jobs`

CI jobs to be run in an environment such as GitHub Actions.

These are typically used by blocks that add package scripts to signal that those scripts should be run in CI.

For example, a block that adds a call to AreTheTypesWrong in CI:

```ts
import { BlockPhase } from "create";

import { schema } from "../schema";

export const blockCSpell = schema.createBlock({
	phase: BlockPhase.Lint,
	produce() {
		return {
			jobs: [
				{
					name: "Check Package Types",
					steps: [{ run: "npx --yes @arethetypeswrong/cli --pack ." }],
				},
			],
		};
	},
});
```

### `metadata`

Descriptions of what files, matched by glob.

Metadata can be useful when blocks rely on other blocks.
Often, earlier blocks will describe the types of files they allow users to add on disk.
Later blocks can use that metadata to inform globs in the files they produce.

For example, this Tsup block reads metadata to exclude test files from its `entry`:

```ts
import { schema } from "./schema";

export const blockTsup = schema.createBlock({
	produce() {
		return {
			files: {
				"tsup.config.ts": `import { defineConfig } from "tsup";
	// ...
	entry: [${JSON.stringify(
		[
			"src/**/*.ts",
			...(metadata
				?.filter(({ type }) => type === MetadataFileType.Test)
				.map((file) => file.glob) ?? []),
		].sort(),
	)}],
	// ...
`,
			},
		};
	},
});
```
