---
description: "Options and shared helpers made available to Blocks and Inputs."
title: Contexts
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

_Context_ objects are provided to [Blocks](../concepts/blocks), [Inputs](../inputs), and [Bases](../concepts/bases).
Each contains shared helper functions and information.

- Bases receive [Base Contexts](#base-contexts)
- Blocks and Presets receive [Block Contexts](#block-contexts)
- Inputs receive [Input Contexts](#input-contexts)
- Production APIs receive [System Contexts](#system-contexts)

## Base Contexts

The Context object provided to the `produce` object of [Bases](../concepts/bases).

### `options` {#base-options}

Any manually provided values as described by the [Base's `options`](../concepts/bases#options).

[Base `produce()`](../concepts/bases#production) methods are designed to fill in any options not manually provided by the user.
Options that are manually provided are available under the Base Context's `options`.

For example, this Base defaults an `name` option to a kebab-case version of its `title` option:

```ts
export const base = createBase({
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

### `take` {#base-take}

Executes an [Input](./inputs).
This is the same as [Input Contexts' `take`](#input-take).

## Block Contexts

The Context object provided to the `produce` object of [Blocks](../concepts/blocks).

### `addons`

Any [Block Addons](../concepts/blocks#addons) that have been provided by other Blocks.

For example, this Gitignore Block defines an `ignores` Addon that other Blocks can use to add to its created `.gitignore` file:

```ts
export const blockGitignore = base.createBlock({
	addons: {
		ignores: z.array(z.string()).default([]),
	},
	produce({ addons }) {
		return {
			files: {
				".gitignore": ["/node_modules", ...addons.ignores].join("\n"),
			},
		};
	},
});
```

### `options` {#block-options}

User-provided values as described by the parent [Base](./bases).

Bases fill in option values before running Blocks.
Each Block created by a Base will run with the same set of options.

For example, this Base defines a `title` option, which is then used by a Block to print a `README.md` heading:

```ts
import { createBase } from "create";

export const base = createBase({
	options: {
		name: z.string(),
	},
});
```

## Input Contexts

The Context object provided to the `produce` object of [Inputs](../inputs).

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

### `fetcher` {#input-fetcher}

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

### `fs` {#input-fs}

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

### `runner` {#input-runner}

An `execa` shell script to run commands.

This is useful for data that's easiest to pull from the CLI.

For example, an Input that retrieves the current Git user's email:

```ts
import { createInput } from "create";

export const inputGitUserEmail = createInput({
	async produce({ runner }) {
		return (await runner("git config user.email")).stdout;
	},
});
```

### `take` {#input-take}

Executes an [Input](./inputs).

The `take` function is provided to both Blocks and Inputs so that they can run another Input with the same Context they're running in.

For example, this Block uses `take` to run Inputs that reads from a local file and run `npm whoami` to make sure the user is listed in an `AUTHORS.md` file:

```ts
import { base } from "./base";
import { inputFile } from "./inputFile";
import { inputNpmWhoami } from "./inputNpmWhoami";

const fileName = "AUTHORS.md";

export const blockFileModified = base.createBlock({
	async produce({ take }) {
		const existing = await take(inputFile, { fileName });
		const author = await take(inputNpmWhoami);

		return {
			files: {
				[fileName]: existing.includes(`${author}\n`)
					? existing
					: `${existing}\n${author}`,
			},
		};
	},
});
```

:::note
Bases and Inputs aren't required to use `take()` for dynamic data.
Doing so just makes that data easier to [mock out in tests](../testing/inputs) later on.
:::

## System Contexts

The Context object provided to [producer APIs](../apis/producers).

### `fetcher` {#system-fetcher}

The global `fetch` function, to make network calls.
This is the same as [Input Contexts' `fetcher`](#input-fetcher).

### `fs` {#system-fs}

A virtual wrapper around the file system.
This is an expanded version of [Input Contexts' `fs`](#input-fs).

System `fs` objects include the following properties:

- `readFile`: Given a file path, returns a Promise for its contents as a `string`
- `writeDirectory`: Given a directory path, returns a Promise for creating a directory there if one doesn't exist
- `writeFile`: Given a file path and text contents, returns a Promise for writing to the file

### `options` {#system-options}

Any values as described by the [Base's `options`](../concepts/bases#options) for the entity being produced.

### `runner` {#system-runner}

An `execa` shell script to run commands.
This is an the same as [Input Contexts' `runner`](#input-runner).
