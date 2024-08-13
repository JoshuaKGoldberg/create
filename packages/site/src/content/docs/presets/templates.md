---
title: Template Repositories
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Users may opt to keep a [GitHub template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) storing a canonical representation of their template. The template can reference that repository's locator. Projects created from the template can then be [created from the template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

For example, a preset referencing a GitHub repository:

```ts
import { createPreset } from "@create-/preset";

export const myTemplatePreset = createPreset({
	repository: "https://github.com/owner/repository",
	produce() {
		// ...
	},
});
```

This is necessary for including the "generated from" notice on repositories for a template. The repository containing a preset might be built with a different preset. For example, a repository containing presets for different native app builders might itself use a general TypeScript preset.
