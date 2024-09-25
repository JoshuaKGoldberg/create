---
title: Running from a Configuration File
---

:::danger
The `create` engine is only partially implemented.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Users will alternately be able to set up the blocks and addons in a file like `create.config.ts`.
They will have the user default-export calling a `createConfig` function with an array of blocks.

For example, a small project that only configures one TypeScript block to have a specific compiler option:

```ts
// create.config.ts
import { createConfig } from "@create/config";
import { blockTsc } from "@example/block-tsc";

export default createConfig([
	blockTsc({
		compilerOptions: {
			target: "ES2024",
		},
	}),
]);
```

A more realistic example would be this equivalent to the `create-typescript-app` "common" base with a logo and bin using a dedicated preset:

```ts
// create.config.ts
import { createConfig } from "@create/config";
import { presetTypeScriptPackageCommon } from "@example/preset-typescript-package-common";

export default createConfig(
	presetTypeScriptPackageCommon({
		bin: "./bin/index.js",
		readme: {
			logo: "./docs/my-logo.png",
		},
	}),
);
```

Running a command like `npx create` will detect the `create.config.ts` and re-run `create` for the repository.
