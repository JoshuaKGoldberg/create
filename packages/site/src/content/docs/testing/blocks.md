---
title: Testing Blocks
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The separate `create-testers` package includes testing utilities that provide mock data to an entity under test.
For [Blocks](../concepts/blocks), a `testBlocks` function is exported that is analogous to [`produceBlock`](../api/produce-block).

For example, this test asserts that an nvmrc Block creates an `".nvmrc"` file with content `"20.12.2"`:

```ts
import { testBlock } from "create-testers";

import { blockNvmrc } from "./blockNvmrc";

describe("blockNvmrc", () => {
	it("returns an .nvmrc", () => {
		const actual = await testBlock(blockNvmrc);

		expect(actual).toEqual({
			files: { ".nvmrc": "20.12.2" },
		});
	});
});
```

## Arguments

1. `blockFactory` (required): a [Block](../concepts/blocks) Factory
2. `settings` (optional): production settings including the Block's [Options](../concepts/blocks#options) and any [Args](../concepts/blocks#args)

`settings` and all its properties are optional.
However, some properties will cause `testBlock` to throw an error if they're not provided and the Block attempts to use them.

- [`args`](#args): throws an error if accessed at all
- [`created`](#created): by default, set to an object with empty `{}` and `[]`s for each property
- [`options`](#options): each property throws an error if accessed at all
- [`take`](#take): by default, throws an error if called as a function

### `args`

[Block Args](../concepts/blocks#args) may be provided under `args`.

For example, this test asserts that a Prettier block adds a `useTabs` arg to its output `".prettierrc.json"`:

```ts
import { testBlock } from "create-testers";
import { z } from "zod";

import { schema } from "./schema";

const blockPrettier = schema.createBlock({
	args: {
		useTabs: z.boolean(),
	},
	produce({ args }) {
		return {
			files: {
				".prettierrc.json": JSON.stringify({
					$schema: "http://json.schemastore.org/prettierrc",
					useTabs: args.useTabs,
				}),
			},
		};
	},
});

describe("blockPrettier", () => {
	it("creates a .prettierrc.json when provided options", () => {
		const actual = await testBlock(blockPrettier, {
			options: {
				config: {
					useTabs: true,
				},
			},
		});

		expect(actual).toEqual({
			files: {
				".prettierrc.json": JSON.stringify({
					$schema: "http://json.schemastore.org/prettierrc",
					useTabs: true,
				}),
			},
		});
	});
});
```

### `created`

[Indirection creations](../runtime/creations#indirect-creations) from previous Blocks may be simulated by passing in a `created` option.

For example, this test simulates previously created [`documentation`](../runtime/creations#documentation) for a Block that generates [`files`](../runtime/creations#files) based on them:

```ts
import { testBlock } from "create-testers";

import { schema } from "./schema";

const blockDocs = schema.createBlock({
	produce({ created }) {
		return {
			files: {
				"DEVELOPMENT.md": [
					"# Development",
					...Object.entries(created.documentation).flatMap(
						([heading, text]) => [`## ${heading}`, text],
					),
				].join("\n\n"),
			},
		};
	},
});

describe("blockDocs", () => {
	it("includes all documentation sections in DEVELOPMENT.md", async () => {
		const actual = await testBlock(blockDocs, {
			created: {
				documentation: {
					Debugging: `Here are some steps to debug the app...`,
				},
			},
		});

		expect(actual).toEqual({
			files: {
				"DEVELOPMENT.md": `# Development

## Debugging

Here are some steps to debug the app...`,
			},
		});
	});
});
```

### `options`

[Schema options](../concepts/schemas#options) may be provided under `options`.

For example, this test asserts that a README.md uses the `title` defined under `options`:

```ts
import { createSchema } from "create";
import { testBlock } from "create-testers";

const schema = createSchema({
	options: {
		title: z.string(),
	},
});

const blockReadme = schema.createBlock({
	produce({ options }) {
		return {
			files: {
				"README.md": `# ${options.title}`,
			},
		};
	},
});

describe("blockDocs", () => {
	it("uses options.name for the README.md title", async () => {
		const actual = await testBlock(blockReadme, {
			options: {
				title: "My Project",
			},
		});

		expect(actual).toEqual({
			files: {
				"README.md": `# My Project`,
			},
		});
	});
});
```

### `take`

The [Context `take` function](../runtime/contexts#take) may be provided under `take`.

This can be useful for simulating the results of [Inputs](../concepts/inputs).

For example, this test asserts that a block prints a _"last modified"_ timestamp in a `last-touch.txt`:

```ts
import { inputNow } from "./inputNow";
import { schema } from "./schema";

const schema = createSchema({
	options: {
		title: z.string(),
	},
});

const blockUsingNow = schema.createBlock({
	produce({ take }) {
		const now = take(inputNow);

		return {
			files: {
				"last-touch.txt": now.toString(),
			},
		};
	},
});

describe("blockUsingNow", () => {
	it("uses options.name for the README.md title", async () => {
		const actual = await testBlock(blockUsingNow, {
			take: () => 1234567,
		});

		expect(actual).toEqual({
			files: {
				"last-touch": "1234567",
			},
		});
	});
});
```

## Return

As with [`produceBlock`](../api/produce-block), `testBlock` returns a Promise for the Block's [`Creation`](../runtime/creations).
Both [direct creations](../runtime/creations#direct-creations) and [indirect creations](../runtime/creations#indirect-creations) will be present.
