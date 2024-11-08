---
title: FAQs
---

## Consumption

### How do I use `create`?

For now, you don't.
It's still _very_ early stage.

Soon, there will be APIs added and documented that allow providing a [Preset](./concepts/presets) and having the `create` engine _create_ a new repository or _update_ an existing one.

Having `npx create` _(or something similar)_ will be able to take in a package containing a Preset and run with it.
For example, using a Preset soon to be provided by [`create-typescript-app`](https://www.npmjs.com/package/create-typescript-app):

```shell
npx create typescript-app
```

Later, there will be higher-level scaffolding utilities that will allow packages such as `create-typescript-app` to:

- Be run on their own (i.e. `npx create-typescript-app`)
- Generate full documentation websites to describe their Blocks and Presets
- Manage and keep updated sample repositories for their presets

See [JoshuaKGoldberg/create-typescript-app#1181 📝 Documentation: Long-term project vision](https://github.com/JoshuaKGoldberg/create-typescript-app/issues/1181) for more history.

### Will there be GitHub repository template support akin to `create-typescript-app`'s?

Yes, after the _create_ and _update_ APIs are done.

### Will there be repository _migration_ akin to `create-typescript-app`'s?

Yes, after the _create_ and _update_ APIs are done.

## Testing

### Why do some testers allow `take` and others the individual system pieces?

It depends on what APIs the entities under test conceptually use.

| Entity                        | Mock   | Why                                                                                           |
| ----------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| [Blocks](./concepts/blocks)   | `take` | Blocks should go through Inputs to interact with the system.                                  |
| [Inputs](./concepts/inputs)   | Both   | Inputs receive system pieces, and can also `take` other Inputs.                               |
| [Presets](./concepts/presets) | System | High-level users of Presets should not care about low-level implementation details of Inputs. |
| [Schemas](./concepts/schemas) | `take` | Schemas should go through Inputs to interact with the system                                  |

## Tool Comparisons

:::danger
These project comparisons have not yet been vetted by maintainers on the projects.
They might be wildly inaccurate.
:::

### How does `create` compare to repository templates such as `create-next-app`, `create-react-app`, etc.?

`create` is an engine that allows you to define repository templates.
It itself is not a repository template; it instead provides APIs that you can use to build your own repository template.

In other words, `create` is a lower-level primitive that can be used to create higher-level `create-*-app` templates.

:::note
For more history on how `create` came to be, see [JoshuaKGoldberg/create-typescript-app#1181 📝 Documentation: Long-term project vision](https://github.com/JoshuaKGoldberg/create-typescript-app/issues/1181).
:::

### How does `create` compare to Plop?

[Plop](https://github.com/plopjs/plop) is another web ecosystem tool for defining repository templates.
Like `create`, it allows defining templates for generated files.

However, `create` has several key differences from Plop:

- Plop is built around an imperative "actions" API for adding files, as opposed to `create`'s managing of outputs
- Plop only supports file creation, not other actions such as setting repository GitHub systems
- Plop is built on the popular Inquirer.js and Handlebars libraries, but does add type safety when bridging the two -- unlike `create`'s type-safe Zod schema options

In other words, `create` is a more broadly scoped project for full repository generation, whereas Plop is more finely targeted to applying Handlebars templates.

### How does `create` compare to projen?

[projen](https://github.com/projen/projen) is another web ecosystem tool for defining repository templates.
It is similar to `create` in that it is a flexible underlying engine that allows developers define and manage project configurations through code.

However, `create` has several large differences from projen:

- `create` is a generalized, tooling-agnostic _generator engine_ that can also keep repositories updated over time
- projen generally targets tighter integration and management with created projects, including being used in its package scripts

<details>
<summary>More details on <code>create</code> differing from projen</summary>

- _Ecosystem targets:_
  - `create` only includes packages in JavaScript/TypeScript; it only targets support for the web ecosystem.
  - projen includes packages in Go, Java, JavaScript/TypeScript, and Python; it can be generally used for those ecosystems.
- _Integration with generated repositories:_
  - `create` does not add any tooling to generated repositories; it prioritizes inferring options from existing repositories on demand.
  - projen is used in generated repositories and integrates with the repository's tasks.
- _Integration with ecosystem tooling:_
  - `create` does not hardcode types of tasks or the tools used for them.
  - projen bundles its own understanding of ecosystem tools such as package managers and linters, and provides APIs for projects to choose from its preferred tools.
- _Low-level code design principles:_
  - `create` uses lean functions. Output file structures are defined with raw objects and strings.
  - projen leans into classes in its architecture. It heavily uses [jsii](https://github.com/aws/jsii) and defines output files with classes.

</details>

:::note
For more details on how `create` compares to Projen, see [JoshuaKGoldberg/create-typescript-app#1181 📝 Documentation: Long-term project vision#issuecomment-2428303689](https://github.com/JoshuaKGoldberg/create-typescript-app/issues/1181#issuecomment-2428303689)
:::

### How does `create` compare to Yeoman?

[Yeoman](https://yeoman.io) is a much older tool in the web ecosystem for templating.
Its architecture and APIs generally work with older, now-outdated JavaScript practices:

- Project generators must extend `yeoman-generator`'s Generator and define methods that are dynamically discovered and called at runtime
- System interactions such as installing dependencies and writing files are done by imperatively calling Yeoman APIs, as opposed to producing outputs that are managed by `create`
- Persistent options are provided in a raw `.yo-rc.json` JSON file rather than type-safe schema definitions

Yeoman has not been actively maintained in several years.
