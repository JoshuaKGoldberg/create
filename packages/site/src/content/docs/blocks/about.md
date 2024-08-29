---
description: "Each tooling piece outputting files, network requests, and/or shell commands."
title: About Blocks
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

The main logic for template contents will be stored in blocks.
Each will define its shape of user-provided options and resultant outputs.

For example, a block that adds a `.nvmrc` file:

```ts
import { createBlock } from "create";

export const blockNvmrc = createBlock({
	async produce() {
		return {
			files: {
				".nvmrc": "20.12.2",
			},
		};
	},
});
```

Resultant outputs will be passed to `create` to be merged with other _blocks'_ outputs and applied.
Outputs may include:

- `commands`: Cleanup scripts to run after setup
- `debuggers`: VS Code `launch.json` entries
- `documentation`: Markdown content for a development guide
- `extensions`: VS Code extensions to suggest installing
- `metadata`: The types of different created files on disk
- `files`: Files to create or modify on disk
- `packages`: Packages to install
- Network requests to the GitHub API _(to be added soon)_

For example, a block that adds pnpm package deduplication:

```ts
import { createBlock } from "create";

export const blockPnpmDeduplicate = createBlock({
	async produce() {
		return {
			commands: ["pnpm dedupe"],
			scripts: {
				"lint:packages": "pnpm dedupe --check",
			},
		};
	},
});
```

## Delayed Creations

In order to use values provided by other blocks, block outputs can each be provided as a function.
That function will be called with an object containing all previously generated creations.

For example, this Tsup block reads metadata to exclude test files from its `entry`:

```ts
import { BlockOutput, MetadataFileType } from "create";

export function blockTsup(): BlockOutput {
	return {
		files: ({ metadata }) => {
			return {
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
			};
		},
	};
}
```

In other words, blocks will be executed in _two_ phases:

1. An initial phase that can produce outputs
2. A second phase using results from the first to produce more outputs

It would be nice to figure out a way to simplify them into one phase, while still allowing blocks to be dependent on previous blocks' outputs.
A future design iteration might figure that out.
