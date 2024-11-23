---
title: Tester APIs
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

The separate `create-testers` package includes testing utilities that run [Producers](./producers) in fully virtualized environments.
This is intended for use in unit tests that should mock out all [System Context](../runtime/contexts#system-contexts).

```shell
npm i create-testers -D
```

:::tip
`create-testers` is test-framework-agnostic.
You can use it with any typical testing framework, including [Jest](https://jestjs.io) and [Vitest](https://vitest.dev).
:::

## `testBase`

For [Bases](../concepts/bases), a `testBase` function is exported that is analogous to [`produceBase`](./producers#producebase).
It takes in similar arguments:

1. `base` _(required)_: a [Base](../concepts/bases)
2. `settings` _(optional)_: production settings including simulated user-provided [Options](../concepts/blocks#options)

For example, this test asserts that a Base defaults its `value` option to `"default"` when not provided:

```ts
import { testBase } from "create-testers";
import { describe, expect, it } from "vitest";

import { base } from "./base";

describe("base", () => {
	describe("value", () => {
		it("defaults to 'default' when not provided", async () => {
			const actual = await testBase(base);

			expect(actual).toEqual({
				value: "default",
			});
		});
	});
});
```

As with [`produceBase`](./producers#producebase), `testBase` returns a Promise for the Base's Options.

`settings` and all its properties are optional.
However, some properties will cause `testBase` to throw an error if they're not provided and the Base attempts to use them:

- [`options`](#testbase-options): each property throws an error if accessed at all
- [`take`](#testbase-take): by default, throws an error if called as a function

### `options` {#testbase-options}

Simulated user-provided [Base Options](../producers#producebase-options) may be provided under `options`.

For example, this test asserts that a Base uses a `value` if provided:

```ts
import { testBase } from "create-testers";
import { describe, expect, it } from "vitest";

import { base } from "./base";

describe("base", () => {
	describe("value", () => {
		it("uses a provided value when it exists", async () => {
			const value = "override";

			const actual = await testBase(base, {
				options: { value },
			});

			expect(actual).toEqual({ value });
		});
	});
});
```

### `take` {#testbase-take}

The [Context `take` function](../runtime/contexts#take) may be provided under `take`.

This is how to simulate the results of [Inputs](../runtime/inputs).

For example, this test asserts that a Base defaults its `name` to the property in `package.json`:

```ts
import { testBase } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { base } from "./base";
import { inputJsonFile } from "./inputJsonFile";

describe("base", () => {
	describe("name", () => {
		it("uses the package.json name if it exists", async () => {
			const name = "create-create-app";
			const take = vi.fn().mockResolvedValue({ name });

			const actual = await testBase(base, { take });

			expect(actual).toEqual({ name });
			expect(take).toHaveBeenCalledWith(inputJsonFile, "package.json");
		});
	});
});
```

## `testBlock`

For [Blocks](../concepts/blocks), a `testBlocks` function is exported that is analogous to [`produceBlock`](./producers#produceblock).
It takes in similar arguments:

1. `block` _(required)_: a [Block](../concepts/blocks)
2. `settings` _(optional)_: production settings including the Block's [Options](../concepts/blocks#options) and any [Args](../concepts/blocks#args)

For example, this test asserts that an nvmrc Block creates an `".nvmrc"` file with content `"20.12.2"`:

```ts
import { testBlock } from "create-testers";
import { describe, expect, it } from "vitest";

import { blockNvmrc } from "./blockNvmrc";

describe("blockNvmrc", () => {
	it("returns an .nvmrc", async () => {
		const actual = await testBlock(blockNvmrc);

		expect(actual).toEqual({
			files: { ".nvmrc": "20.12.2" },
		});
	});
});
```

As with [`produceBlock`](./producers#produceblock), `testBlock` returns a Promise for the Block's [Creation](../runtime/creations).
Both [Direct Creations](../runtime/creations#direct-creations) and [Indirect Creations](../runtime/creations#indirect-creations) will be present.

`settings` and all its properties are optional.
However, some properties will cause `testBlock` to throw an error if they're not provided and the Block attempts to use them:

- [`args`](#testblock-args): throws an error if accessed at all
- [`created`](#testblock-created): by default, set to an object with empty `{}` and `[]`s for each property
- [`options`](#testblock-options): each property throws an error if accessed at all
- [`take`](#testblock-take): by default, throws an error if called as a function

### `args` {#testblock-args}

[Block Args](../concepts/blocks#args) may be provided under `args`.

For example, this test asserts that a Prettier block adds a `useTabs` arg to its output `".prettierrc.json"`:

```ts
import { testBlock } from "create-testers";
import { describe, expect, expect, it } from "vitest";
import { z } from "zod";

import { base } from "./base";

const blockPrettier = base.createBlock({
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
	it("creates a .prettierrc.json when provided options", async () => {
		const actual = await testBlock(blockPrettier, {
			args: {
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

### `options` {#testblock-options}

[Base Options](../concepts/bases#options) may be provided under `options`.

For example, this test asserts that a README.md uses the `title` defined under `options`:

```ts
import { testBlock } from "create-testers";
import { describe, expect, it } from "vitest";

import { base } from "./base";

const blockReadme = base.createBlock({
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

## `testInput`

For [Inputs](../runtime/inputs), a `testInput` function is exported that is analogous to [`produceInput`](./producers#produceinput).
It takes in similar arguments:

1. `input` _(required)_: an [Input](../runtime/inputs)
2. `settings` _(optional)_: production settings including the Input's [Options](../runtime/inputs#options) and any [Args](../runtime/inputs#args)

For example, this test asserts that an `inputNow` returns a numeric timestamp:

```ts
import { testInput } from "create-testers";
import { describe, expect, it } from "vitest";

import { inputNow } from "./inputNow";

describe("inputNow", () => {
	it("returns a numeric timestamp", async () => {
		const actual = await testInput(inputNow);

		expect(actual).toBeTypeOf("number");
	});
});
```

As with [`produceInput`](./producers#produceinput), `testInput` returns the data from the Input.

`settings` and all its properties are optional.
However, some properties will cause `testInput` to throw an error if they're not provided and the Input attempts to use them:

- [`fetcher`](#testinput-fetcher): by default, throws an error if called as a function
- [`fs`](#testinput-fs): by default, each method throws an error if called as a function
- [`runner`](#testinput-runner): by default, throws an error if called as a function

### `fetcher` {#testinput-fetcher}

A mock function to act as the global [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

For example, this test asserts that an `inputCatFact` Input returns the `fact` property of a response:

```ts
import { testInput } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { inputCatFact } from "./inputCatFact";

describe("inputCatFact", () => {
	it("returns the cat fact from the API", async () => {
		const fact =
			"Owning a cat is actually proven to be beneficial for your health.";

		const fetcher = vi.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ fact }),
		});

		const actual = await testInput(inputCatFact, { fetcher });

		expect(actual).toEqual(fact);
		expect(fetcher).toHaveBeenCalledWith("https://catfact.ninja/fact");
	});
});
```

### `fs` {#testinput-fs}

An object containing mocks to act as a file system.

For example, this test asserts that an `inputFile` input returns the text of a file from disk:

```ts
import { testInput } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { inputFile } from "./inputCatFact";

describe("inputFile", () => {
	it("returns the contents of a file", async () => {
		const contents = "abc123";
		const readFile = vi.fn().mockResolvedValue(contents);

		const actual = await testInput(inputFile, {
			args: { fileName: "text.txt" },
			fs: { readFile },
		});

		expect(actual).toEqual(contents);
		expect(readFile).toHaveBeenCalledWith("text.txt");
	});
});
```

### `runner` {#testinput-runner}

A mock function to act as [`execa`](https://github.com/sindresorhus/execa/blob/main/docs/execution.md).

For example, this test asserts that an `inputGitUserEmail` Input returns the text from running `git config user.email`:

```ts
import { testInput } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { inputGitUserEmail } from "./inputGitUserEmail";

describe("inputGitUserEmail", () => {
	it("returns text from git config user.email", async () => {
		const email = "rick.astley@example.com";

		const runner = vi.fn().mockResolvedValueOnce({
			stdout: email,
		});

		const actual = await testInput(inputGitUserEmail, { runner });

		expect(actual).toEqual(email);
		expect(runner).toHaveBeenCalledWith("git config user.email");
	});
});
```

### `take` {#testinput-take}

The [Context `take` function](../runtime/contexts#take) may be provided under `take`.

This is how to simulate the results of calling to other [Inputs](../runtime/inputs).

For example, this test asserts that an `inputNpmUsername` Input uses the result of an `inputNpmWhoami` Input:

```ts
import { testInput } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { inputNpmUsername } from "./inputNpmUsername";
import { inputNpmWhoami } from "./inputNpmWhoami";

describe("inputNpmUsername", () => {
	it("uses the result of npm whoami when available", async () => {
		const username = "joshuakgoldberg";

		const take = vi.fn().mockResolvedValue({
			stdout: username,
		});

		const actual = await testInput(inputNpmUsername);

		expect(actual).toBe(username);
		expect(take).toHaveBeenCalledWith(inputNpmWhoami);
	});
});
```

## `testPreset`

For [Presets](../concepts/presets), a `testPreset` function is exported that is analogous to [`producePreset`](./producers#producepreset).
It takes in similar arguments:

1. `preset` _(required)_: a [Preset](../concepts/presets)
2. `settings` _(optional)_: production settings including the Preset's [Options](../concepts/presets#options) and any [Args](../concepts/presets#args)

For example, this test asserts that a Preset using an nvmrc Block creates an `".nvmrc"` file with content equal to its `version` option:

```ts
import { testPreset } from "create-testers";
import { describe, expect, it } from "vitest";

import { presetWithNvmrc } from "./presetWithNvmrc";

describe("presetWithNvmrc", () => {
	it("returns an .nvmrc", async () => {
		const actual = await testPreset(presetWithNvmrc, {
			options: {
				version: "20.12.2",
			},
		});

		expect(actual).toEqual({
			files: { ".nvmrc": "20.12.2" },
		});
	});
});
```

As with [`producePreset`](./producers#producepreset), `testPreset` returns a Promise for the Preset's [Creation](../runtime/creations).
Both [Direct Creations](../runtime/creations#direct-creations) and [Indirect Creations](../runtime/creations#indirect-creations) will be present.

`settings` and all its properties are optional.
However, some properties will cause `testPreset` to throw an error if they're not provided and the Block attempts to use them:

- [`fetcher`](#testpreset-fetcher): by default, throws an error if called as a function
- [`fs`](#testpreset-fs): by default, each method throws an error if called as a function
- [`runner`](#testpreset-runner): by default, throws an error if called as a function

### `fetcher` {#testpreset-fetcher}

A mock function to act as the global [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

For example, this test asserts that a Preset internally fetches cat facts from an API and stores them in a file:

```ts
import { testPreset } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { presetWithCatFact } from "./presetWithCatFact";

describe("presetWithCatFact", () => {
	it("prints the cat fact from the API in fact.txt file", async () => {
		const fact =
			"Owning a cat is actually proven to be beneficial for your health.";

		const fetcher = vi.fn().mockResolvedValueOnce({
			json: () => Promise.resolve({ fact }),
		});

		const actual = await testPreset(presetWithCatFact, { fetcher });

		expect(actual).toEqual({
			files: {
				"fact.txt": fact,
			},
		});
		expect(fetcher).toHaveBeenCalledWith("https://catfact.ninja/fact");
	});
});
```

### `fs` {#testpreset-fs}

An object containing mocks to act as a file system.

For example, this test asserts that a Preset internally copies a `backup.txt` file to an `current.txt` file:

```ts
import { testPreset } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { presetWithBackup } from "./inputCatFact";

describe("presetWithBackup", () => {
	it("copies backup.txt to current.txt when backup.txt exists", async () => {
		const contents = "abc123";
		const readFile = vi.fn().mockResolvedValue(contents);

		const actual = await testPreset(presetWithBackup, {
			fs: { readFile },
		});

		expect(actual).toEqual({
			files: {
				"current.txt": contents,
			},
		});
		expect(readFile).toHaveBeenCalledWith("backup.txt");
	});
});
```

### `runner` {#testpreset-runner}

A mock function to act as [`execa`](https://github.com/sindresorhus/execa/blob/main/docs/execution.md).

For example, this test asserts that Preset includes the running user's email in an `AUTHORS.md` file:

```ts
import { testPreset } from "create-testers";
import { describe, expect, it, vi } from "vitest";

import { presetAuthorship } from "./presetAuthorship";

describe("presetAuthorship", () => {
	it("puts the running user's git config user.email in AUTHORS.md", async () => {
		const email = "rick.astley@example.com";

		const runner = vi.fn().mockResolvedValueOnce({
			stdout: email,
		});

		const actual = await testPreset(presetAuthorship, { runner });

		expect(actual).toEqual({
			files: {
				"AUTHORS.md": email,
			},
		});
		expect(runner).toHaveBeenCalledWith("git config user.email");
	});
});
```
