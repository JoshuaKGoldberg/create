---
description: "Standalone functions to read in dynamic data."
title: Inputs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

An _Input_ defines a standalone function to provide any dynamic data needed to inform production.
Unlike [Blocks](./blocks) and [Presets](./presets), Inputs are not bound to any one [Schema](./schemas).
Inputs may be shared and used freely within production functions.

The kinds of dynamic data sourced by Inputs often include:

- Files on disk, such as raw text or parsed `.json`
- Sending network requests
- Running terminal commands, such as `npm whoami`

`create` will manage providing inputs with a runtime [Context](../runtime/contexts) containing a file system, network fetcher, and shell runner.

## Production

Inputs define their logic for reading data in a `produce()` function.

For example, an input that retrieves the current running time:

```ts
import { createInput } from "create";

export const inputNow = createInput({
	produce() {
		return performance.now();
	},
});
```

Later on, a Block could use that input to retrieve the current running time:

```ts
import { inputNow } from "./inputNow";
import { schema } from "./schema";

export const blockUsingNow = schema.createBlock({
	produce({ take }) {
		const now = take(inputNow);

		return {
			files: {
				"last-touch.txt": now.toString(),
			},
		};
	},
});
```

That block would instruct `create` to create a `last-touch.txt` file with the current `performance.now()` timestamp when run.

:::note
Production functions aren't required to use Inputs for dynamic data.
Doing so just makes that data easier to [mock out in tests](../testing/inputs) later on.
:::

## Context

Inputs have access to the shared [Context](../runtime/contexts) managed by `create`.
They can use that Context to access the file system, execute shell scripts, or other system interactions.

For example, a block that uses the [Context's `runner`](../runtime/context#runner) to execute `npm whoami`:

```ts
import { createInput } from "create";

export const inputNpmWhoami = createInput({
	produce({ runner }) {
		return (await runner("npm whoami")).stdout;
	},
});
```

That Input can then be used by later Blocks and/or Inputs to retrieve the logged-in npm user, if one exists.

## Args

Inputs being standalone means they have no access to Schema Options.
Instead, Inputs may define and take in their Args.

Inputs describe those Args as the properties of a Zod object schema.
That allows them validate provided values and infer types from an `args` property in their context.

For example, an input that retrieves JSON data from a file on disk using the provided virtual file system:

```ts
import { createInput } from "create";
import { z } from "zod";

export const inputJSONFile = createInput({
	args: {
		fileName: z.string(),
	},
	async produce({ args, fs }) {
		try {
			return JSON.parse((await fs.readFile(args.fileName)).toString());
		} catch {
			return undefined;
		}
	},
});
```

Later on, [`take`](../runtime/contexts#take) calls to the Input will be able to provide those Args.

## Composition

Inputs are composable: meaning each can take data from other Inputs.
As with Blocks, the [Context](../runtime/contexts) provided to Inputs includes a `take` function that calls to another Input.

For example, an Input that determines the npm username based on either `npm whoami` or `package.json` Inputs:

```ts
import { createInput } from "create";

import { inputJSONFile } from "./inputJsonData";
import { inputNpmWhoami } from "./inputNpmWhoami";

export const inputNpmUsername = createInput({
	async produce({ take }) {
		return (
			(await take(inputNpmWhoami)) ??
			(await take(inputJSONFile, { fileName: "package.json" })).author
		);
	},
});
```

## APIs

- [`createInput`](../apis/creators#createschema): for creating Inputs
- [`produceInput`](../apis/producers#produceschema): for producing an Input's data
- [`testInput`](../apis/testers#testinput): for simulating running an Input
