---
description: "Option types and default values that will be used to scaffold a repository."
title: Schemas
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

A _Schema_ defines an object of option types and default values that will be used to scaffold a repository.
Schemas are used to generate [Blocks](./blocks) and [Presets](./presets.md) that rely on user-specified values for those options.

## Options

Schemas are generated with a `createSchema()` function.
That function's object parameter requires an `options` property storing each option as a Zod type.

For example, a minimal Schema that stores only a name string could look like:

```ts
import { createSchema } from "create";

export const schema = createSchema({
	options: {
		name: z.string(),
	},
});
```

Blocks and Presets made with that `schema` will have access to the `name` option of type `string`.

## Produce

Schemas can optionally define a `produce()` function that reads in any number of their options from an existing repository.
Doing so is used when running `create` to update a repository that was previously set up with the same [Preset](./preset).

`produce()` methods receive a [Schema Context](../runtime/contexts#schema-contexts) parameter.
They must return an object whose properties fill in any options that can be inferred from the system.
Each property may either be a value or an function asynchronous function to retrieve that value.

For example, this schema allows defaulting a required `name` option to that property of its `package.json` using an [Input](./input):

```ts
import { createSchema } from "create";
import { z } from "zod";

import { inputJsonFile } from "./inputJsonFile";

export const schema = createSchema({
	options: {
		name: z.string(),
	},
	produce({ take }) {
		return {
			name: async () =>
				(await take(inputJsonFile, { fileName: "package.json" })).name,
		};
	},
});
```

### Lazy Production

Note that `produce()` is itself not an async function.
This is to encourage options to be lazy: they should only be evaluated if needed.
The [`lazy-value`](https://www.npmjs.com/package/lazy-value) package can be used to create chained lazy properties.

For example, this Schema retrieves both a `description` and a `name` from a `package.json` on disk lazily:

```ts
import { createSchema } from "create";
import lazyValue from "lazy-value";
import { z } from "zod";

import { inputJsonFile } from "./inputJsonFile";

export const schema = createSchema({
	options: {
		description: z.string(),
		name: z.string(),
	},
	produce({ take }) {
		const packageData = lazyValue(async () =>
			take(inputJsonFile({ fileName: "package.json" })),
		);

		return {
			description: async () => (await packageData()).description,
			name: async () => (await packageData()).name,
		};
	},
});
```

That `produce()` will only read and parse the `package.json` file if either of `description` and/or `name` are not provided by the user.

### Production Options

`produce()`'s Context parameter contains an `options` property with any options explicitly provided by the user.
This may be useful if the logic to produce some options should set defaults based on other options.

For example, this Schema defaults an `author` option to the `owner` option:

```ts
import { createSchema } from "create";
import { z } from "zod";

export const schema = createSchema({
	options: {
		author: z.string().optional(),
		owner: z.string(),
	},
	produce({ options }) {
		return {
			author: options.owner,
		};
	},
});
```
