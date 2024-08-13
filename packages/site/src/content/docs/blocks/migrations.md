---
title: Block Migrations
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Blocks should be able to describe how to bump from previous versions to the current. Those descriptions will be stored as _migrations_ detailing the actions to take to migrate from previous versions.

For example, a block adding in Knip that switches from `knip.jsonc` to `knip.json`:

```ts
import { BlockContext, BlockOutput } from "@create-/block";

export function blockKnip({ fs }: BlockKnip): BlockOutput {
	return {
		files: {
			"knip.json": JSON.stringify({
				$schema: "https://unpkg.com/knip@latest/schema.json",
			}),
		},
		migrations: [
			{
				name: "Rename knip.jsonc to knip.json",
				run: async () => {
					try {
						await fs.rename("knip.jsonc", "knip.json");
					} catch {
						// Ignore failures if knip.jsonc doesn't exist
					}
				},
			},
		],
	};
}
```

Migrations will allow `create` to be run in an idempotent `--migrate` mode that can keep a repository up-to-date automatically.
