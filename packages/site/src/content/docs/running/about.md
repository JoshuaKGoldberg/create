---
title: Runtime
---

:::danger
The `create` engine does not exist yet.
This site is "documentation-driven development": writing the docs first, to help inform implementation.
:::

Creating or updating a repository will be done by running the `create` package's CLI.
The CLI will take in some combination of [blocks](../blocks/about), such as those provided by a [preset](../presets/about), and output files, network calls, and shell commands on disk.

Specifically, that means each run of `create` will:

1. Initialize shared context: the built-in options, file system, network fetcher, and shell runner
2. Run blocks in order with their portions of the context
   - File, network, and shell operations are stored so they can be run later
   - Migrations are also stored to be run later
   - Any metadata are stored and merged internally
3. Run any stored migrations
4. Run delayed portions of blocks in order that required metadata
5. Run all stored file, network, and shell operations

There may need to be options provided for changing when pieces run.
For example, there may be migrations that depend on being run before stored file operations.

### `create` Monorepo Support

Adding explicit handling for monorepos is not something I plan for a v1 of `create`.
I'll want to have experience maintaining a few more of my own monorepos before seriously investigating what that would look like.

This does not block end-users from writing monorepo-tailored blocks or presets.
They can always write two versions of their logic for the ones that need it, such as:

- `@example/block-tsc`
- `@example/block-tsc-references`

Alternately, individual packages can always configure `create` tooling on their own.
