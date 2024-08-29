---
title: Inputs
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Inputs will be small functions that provide any data needed to inform blocks and addons later.
These may include:

- Files on disk, such as raw text or parsed `.json`
- Sending network requests
- The user's `npm whoami`

`create` will manage providing inputs with a runtime context containing a file system, network fetcher, and shell runner.

For example, an input that retrieves the current running time:

```ts
import { createInput } from "create";

export const inputNow = createInput({
	produce: () => performance.now(),
});
```

Later on, a block could use that input to retrieve the current running time:

```ts
import { createBlock } from "create";

import { inputNow } from "./inputNow";

export const blockUsingNow = createBlock({
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

Note that code won't be required to use inputs to source data.
Doing so just makes that data easier to [mock out in tests](../testing/inputs) later on.
