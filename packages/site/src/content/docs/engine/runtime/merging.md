---
description: "How the engine merges Block Addons and Creations at runtime."
title: Merging
---

[Blocks](../concepts/blocks) act as synchronous functions with optional metadata in the form of [Addons](../concepts/blocks#addons).
Blocks don't know what order they're run in or what other Blocks exist.
They only know to map Addons and Options inputs to output [Creations](./creations).

## Addons

At runtime, the `create` engine will often need to re-run Blocks continuously as they receive Addons from other Blocks.
Blocks will be re-run whenever other Blocks signal new Addon data to them that they haven't yet seen.
This allows Blocks to not need any explicit indication of what order to run in.

Addons are merged by concatenating arrays and removing duplicate elements.
Duplicates are detected by [`hash-object`](https://www.npmjs.com/package/hash-object) object hashing.

For example, given the following two Addons to be merged:

```ts
[
	{ name: "First", steps: ["a", "b"] },
	{ name: "Second", steps: ["c", "d"] },
];
```

```ts
[
	{ name: "Second", steps: ["c", "d"] },
	{ name: "Third", steps: ["e", "f"] },
],
```

The merged result would be:

```ts
[
	{ name: "First", steps: ["a", "b"] },
	{ name: "Second", steps: ["c", "d"] },
	{ name: "Third", steps: ["e", "f"] },
];
```

## Creations

Each of the four other Creations from Blocks has their own merging logic:

- [`files`](#files)
- [`requests`](#requests)
- [`scripts`](#scripts)
- [`suggestions`](#suggestions)

### Files

[File](./creations#files) objects are recursively merged:

- `false` and `undefined` values are ignored
- Files are deduplicated if they have the same value, and an error is thrown if they do not

For example, given the following two `files` Creations to be merged:

```ts
{
   "LICENSE.txt": "# MIT",
   src: {
      "index.ts": `export * from "./types.ts"`,
   },
}
```

```ts
{
   "LICENSE.txt": "# MIT",
   src: {
      "types.ts": `export type Example = true;`,
   },
}
```

The merged result would be:

```ts
{
   "LICENSE.txt": "# MIT",
   src: {
      "index.ts": `export * from "./types.ts"`,
      "types.ts": `export type Example = true;`,
   },
}
```

### Requests

[Requests](./creations#requests) are deduplicated based on their `id`.
Later-created requests will override any previously created requests with the same `id`.

For example, given the following two `requests` Creations to be merged:

```ts
[
	{
		id: "branch-protection",
		async send({ octokit }) {
			console.log("TODO: Set up branch protection");
		},
	},
];
```

```ts
[
	{
		id: "branch-protection",
		async send({ octokit }) {
			await octokit.request(
				`PUT /repos/{owner}/{repository}/branches/{branch}/protection`,
				{
					branch: "main",
					// ...
				},
			);
		},
	},
];
```

The merged result would be just the latter Creation:

```ts
[
	{
		id: "branch-protection",
		async send({ octokit }) {
			await octokit.request(
				`PUT /repos/{owner}/{repository}/branches/{branch}/protection`,
				{
					branch: "main",
					// ...
				},
			);
		},
	},
];
```

### Scripts

[Scripts](./creations#scripts) are deduplicated based on whether they include a `phase`:

- "Phase" scripts are deduplicated if any's arrays of `commands` are the same as any other
- "Standalone" scripts provided as `string` are deduplicated and run in parallel after scripts with phases

For example, given the following two `scripts` Creations to be merged:

```ts
[
	{
		commands: ["pnpm install", "pnpm dedupe"],
		phase: 0,
	},
];
```

```ts
[
	`npx set-github-repository-labels --labels "$(cat labels.json)"`,
	{
		commands: ["pnpm install"],
		phase: 0,
	},
];
```

The merged result would be:

```ts
[
	{
		commands: ["pnpm install", "pnpm dedupe"],
		phase: 0,
	},
	`npx set-github-repository-labels --labels "$(cat labels.json)"`,
];
```

### Suggestions

[Suggestions](./creations#suggestions) are deduplicated by identity.

For example, given the following two `suggestions` Creations to be merged:

```ts
[
	"- set a CODECOV secret to an codecov repository token",
	"- set a NPM_TOKEN secret to an npm automation token",
];
```

```ts
[
	"- set an ACCESS_TOKEN secret to a GitHub PAT with repo and workflow permissions",
	"- set a NPM_TOKEN secret to an npm access token with automation permissions",
];
```

The merged result would be:

```ts
[
	"- set a CODECOV secret to an codecov repository token",
	"- set a NPM_TOKEN secret to an npm access token with automation permissions",
	"- set an ACCESS_TOKEN secret to a GitHub PAT with repo and workflow permissions",
];
```
