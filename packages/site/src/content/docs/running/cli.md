---
title: Running from the CLI
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Initializing or updating a repository can be done by running `create` on the CLI.
Zod arguments will be automatically converted to Node.js `parseArgs` args.

Using a preset named `my-create-preset` with a `title: z.string()` option:

```shell
npx create --preset my-create-preset --preset-option-title "My Repository"
```

The result of running the CLI will be a repository that's ready to be developed on immediately.

## Prompts

It's common for template builders to include a CLI prompt for options. `create` will provide a dedicated CLI package that prompts users for options based on the Zod `options` schema for a preset.

For example, given a preset that describes its name and other documentation:

```ts
import { schema } from "./schema";

export const myPreset = schema.createPreset({
	about: {
		name: "My Preset",
	},
	options: {
		access: z
			.union([z.literal("public"), z.literal("private")])
			.default("public"),
		description: z.string(),
	},
	produce() {
		/* ... */
	},
});
```

...a `create` CLI would be able to prompt a running user for each of those options:

```plaintext
npx create-my-preset

Let's ✨ create ✨ a repository for you based on My Preset!

> Enter a value for access.
  Allowed values: "public", "private" (default: "public")
  ...

> Enter a value for description:
  ...

> Would you like to make a create.config.ts file to pull in template updates later?
  y/n
```

Future versions of `create` could provide hooks to customize those CLIs, such as adding more documentation options in `createPreset`.
