---
description: "Options and shared helpers made available to Blocks and Inputs."
title: Contexts
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

_Context_ objects are provided to [Blocks](../concepts/blocks), [Inputs](../concepts/inputs), and [Schemas](../concepts/schemas).
Each contains shared helper functions and information.

All Contexts include the properties described in [All Contexts](#all-contexts).
Each area's Contexts provides additional properties:

- Blocks receive [Block Contexts](#block-contexts)
- Inputs receive [Input Contexts](#input-contexts)
- Schemas receive [Schema Contexts](#schema-contexts)

## All Contexts

### `take`

Executes an [Input](./inputs).

The `take` function is provided to both Blocks and Inputs so that they can run another Input with the same Context they're running in.

For example, this Block uses `take` to run inputs that reads from a local file and run `npm whoami` to make sure the user is listed in an `AUTHORS.md` file:

```ts
import { inputFile } from "./inputFile";
import { inputNpmWhoami } from "./inputNpmWhoami";
import { schema } from "./schema";

const fileName = "AUTHORS.md";

export const blockFileModified = schema.createBlock({
	async produce({ take }) {
		const existing = await take(inputFile, { fileName });
		const author = await take(inputNpmWhoami);

		return {
			files: {
				[fileName]: existingContents.includes(`${existing}\n`)
					? existingContents
					: `${existingContents}\n${author}`,
			},
		};
	},
});
```

:::note
Blocks and Inputs aren't required to use `take()` for dynamic data.
Doing so just makes that data easier to [mock out in tests](../testing/inputs) later on.
:::

## Block Contexts

The Context object provided to the `produce` object of [Blocks](../concepts/blocks).

### `created`

In-progress [Indirect Creation properties](./creations#indirect-creations) from any previously run Blocks.

This can be useful if one Block relies on the output of a previous block.
Blocks may reference the outputs of earlier Blocks to generate their own tooling.

For example, a Block that generates a `.github/DEVELOPMENT.md` file summarizing previously generated [`documentation`](./production#documentation):

```ts
import { BlockPhase } from "create";

import { schema } from "./schema";

export const blockDocs = schema.createBlock({
	phase: BlockPhase.Documentation,
	produce({ created }) {
		return {
			files: {
				".github": {
					"DEVELOPMENT.md": `# Development

${Object.entries(created.documentation)
	.flatMap(([heading, content]) => [`## ${heading}`, content])
	.join("\n\n")}
`,
				},
			},
		};
	},
});
```

See [Phases](./phases) for how blocks can request an order to run in.

### `options` {#block-options}

User-provided values as described by the parent [Schema](./schemas).

Schemas fill in option values before running Blocks.
Each Block created by a Schema will run with the same set of options.

For example, this Schema defines a `title` option, which is then used by a Block to print a `README.md` heading:

```ts
import { createSchema } from "create";

export const schema = createSchema({
	options: {
		name: z.string(),
	},
});
```

## Input Contexts

The Context object provided to the `produce` object of [Inputs](../concepts/inputs).

### `args` {#input-options}

The arguments provided to this input from its `take` call.

These (for now) must be an object storing each arg as a Zod type.

For example, a minimal Input that combines two numbers:

```ts
import { createInput } from "create";
import { z } from "zod";

export const inputFile = createInput({
	args: {
		a: z.number(),
		b: z.number(),
	},
	async produce({ args }) {
		return args.a + args.b;
	},
});
```

Unlike that minimal example, Inputs generally use one or more of the following properties to read from the user's file system and/or network.

### `fs`

A virtual wrapper around the file system.

For now, the `fs` object contains a single property:

- `readFile`: Given a file path, returns a Promise for its contents as a `string`

For example, this input reads the contents of a file from disk as a string:

```ts
import { createInput } from "create";
import { z } from "zod";

export const inputFile = createInput({
	args: {
		fileName: z.string(),
	},
	async produce({ args, fs }) {
		return (await fs.readFile(args.fileName)).toString();
	},
});
```

### `fetcher`

The global `fetch` function, to make network calls.

For example, an Input that retrieves a random Cat fact:

```ts
import { createInput } from "create";

export const inputCatFact = createInput({
	async produce({ fetcher }) {
		const response = await fetcher("https://catfact.ninja/fact");
		const data = (await response.json()) as { fact: string };

		return data.fact;
	},
});
```

### `runner`

An `execa` shell script to run commands.

This is useful for data that's easiest to pull from the CLI.

For example, an Input that retrieves the current Git user's email:

```ts
import { createInput } from "create";

export const inputCatFact = createInput({
	async produce({ runner }) {
		return (await runner("git config user.email")).stdout;
	},
});
```

## Schema Contexts

The Context object provided to the `produce` object of [Schemas](../concepts/schemas).

### `options` {#schema-options}

Any manually provided values as described by the [Schema's `options`](../concepts/schemas#options).

[Schema `produce()`](../concepts/schemas#produce) methods are designed to fill in any options not manually provided by the user.
Options that are manually provided are available under the Schema Context's `options`.

For example, this Schema defaults an `name` option to a kebab-case version of its `title` option:

```ts
export const schema = createSchema({
	options: {
		name: z.string().optional(),
		title: z.string(),
	},
	produce({ options }) {
		return {
			name: options.title.toLowerCase().replaceAll(" ", "-"),
		};
	},
});
```
