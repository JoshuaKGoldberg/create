---
title: Template Repositories
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Users may opt to keep a [GitHub template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) storing a canonical representation of their template.
The template can reference that repository's locator.
Projects created from the template can then be [created from the template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

For example, a preset referencing a GitHub repository:

```ts
import { createPreset } from "create";

export const myTemplatePreset = createPreset({
	produce() {
		// ...
	},
	repository: "https://github.com/owner/repository",
});
```

This is necessary for including the "generated from" notice on repositories for a template.
The repository containing a preset might be built with a different preset.
For example, a repository containing presets for different native app builders might itself use a general TypeScript preset.
