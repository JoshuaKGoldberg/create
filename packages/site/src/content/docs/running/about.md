---
title: Runtime
---

:::danger
The `create` engine is very early stage.
Don't rely on it yet.
:::

Creating or updating a repository will be done by running the `create` package's CLI.
The CLI will take in some combination of [blocks](../blocks/about), such as those provided by a [preset](../presets/about), and output files, network calls, and shell commands on disk.

Specifically, that means each run of `create` will:

1. Initialize shared context: the file system, network fetcher, and shell runner
2. Run blocks in phase order with their portions of the context
   - File, network, and shell operations are stored so they can be run later
3. Run all stored file, network, and shell operations

There may need to be options provided for changing when pieces run.

### `create` Monorepo Support

Adding explicit handling for monorepos is not something I plan for a v1 of `create`.
I'll want to have experience maintaining a few more of my own monorepos before seriously investigating what that would look like.

This does not block end-users from writing monorepo-tailored blocks or presets.
They can always write two versions of their logic for the ones that need it, such as:

- `@example/block-tsc`
- `@example/block-tsc-references`

Alternately, individual packages can always configure `create` tooling on their own.
