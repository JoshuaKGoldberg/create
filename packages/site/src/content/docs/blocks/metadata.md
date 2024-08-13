---
title: Block Metadata
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Blocks should be able to signal added metadata on the system that other blocks will need to handle. They can do so by returning properties in a `metadata` object.

Metadata may include:

- `documentation`: A `Record<string, string>` of docs entries to add to `.md` file(s)
- `files`: An array of objects containing `glob: string` and `type: FileType` of `Config`, `Source`, or `Test`
  - Over time, this may need to encompass more metadata, such as whether files are auto-generated

For example, this Vitest block indicates that there can now be `src/**/*.test.*` test files, as documented in `.github/DEVELOPMENT.md`:

```ts
import { BlockOutput, FileType } from "@create-/block";

export function blockVitest(): BlockOutput {
	return {
		files: {
			"vitest.config.ts": `import { defineConfig } from "vitest/config"; ...`,
		},
		metadata: {
			documentation: {
				".github/DEVELOPMENT.md": `## Testing ...`,
			},
			files: [{ glob: "src/**/*.test.*", type: FileType.Test }],
		},
	};
}
```

In order to use _metadata_ provided by other blocks, block outputs can each be provided as a function.
That function will be called with an object containing all previously generated _metadata_.

For example, this Tsup block reacts to _metadata_ to exclude test files from its `entry`:

```ts
import { BlockContext, BlockOutput, FileType } from "@create-/block";

export function blockTsup(): BlockOutput {
	return {
		fs: ({ metadata }: BlockContext) => {
			return {
				"tsup.config.ts": `import { defineConfig } from "tsup";
          // ...
          entry: [${JSON.stringify([
						"src/**/*.ts",
						...metadata.files
							.filter(file.type === FileType.Test)
							.map((file) => file.glob),
					])}],
          // ...
        `,
			};
		},
	};
}
```

In other words, blocks will be executed in _two_ phases:

1. An initial, metadata-less phase that can produce outputs and metadata
2. A second, metadata-provided phase that can produce more outputs

It would be nice to figure out a way to simplify them into one phase, while still allowing _metadata_ to be dependent on options. A future design iteration might figure that out.
