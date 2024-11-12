---
title: FAQs
---

## Consumption

### How do I use `create`?

For now, you don't.
It's still _very_ early stage.

Soon, there will be APIs added and documented that allow providing a [Preset](./concepts/presets) and having the `create` engine _create_ a new repository or _update_ an existing one based on it.

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
| [Inputs](./runtime/inputs)    | Both   | Inputs receive system pieces, and can also `take` other Inputs.                               |
| [Presets](./concepts/presets) | System | High-level users of Presets should not care about low-level implementation details of Inputs. |
| [Schemas](./concepts/schemas) | `take` | Schemas should go through Inputs to interact with the system                                  |

## Tool Comparisons

`create` is targeting being a fully complete solution for defining _creating_, _migrating_, and/or _updating_ repositories to use flexible templates.
Those templates are defined in a feature-by-feature ("Block") basis and with configurable "Presets" using `create` APIs.
`create` templates go beyond just file system copying with network requests, shell commands, and versioned migrations.

Other ecosystem tools exist for part of that feature set.
None target the full feature set of `create`.

In general, `create`'s approach is differentiated from previous projects by:

- Producing outputs -including files and more- in a generalized format ([Direct Creations](./runtime/creations#direct-creations))
- Allowing sub-templates that can be individually swapped individually and add to each other ([Blocks](./concepts/blocks))

:::danger
Most of these project comparisons have not yet been vetted by maintainers on the projects.
They might be wildly inaccurate.
:::

### `create-next-app`, `create-react-app`, `create-typescript-app`, etc

`create` is an engine that allows you to define repository templates.
It itself is not a repository template; it instead provides APIs that you can use to build your own repository template.

In other words, `create` is a lower-level primitive that can be used to create higher-level `create-*-app` templates.

:::note
For more history on how `create` came to be, see [JoshuaKGoldberg/create-typescript-app#1181 📝 Documentation: Long-term project vision](https://github.com/JoshuaKGoldberg/create-typescript-app/issues/1181).
:::

### Cookiecutter

[Cookiecutter](https://github.com/cookiecutter/cookiecutter) is a library and CLI app for generating projects from templates.
It allows taking in directories written as [Jinja](https://palletsprojects.com/projects/jinja) templates and running pre- and post-generation hooks.

`create` has several key differences from what Cookiecutter supports:

- Cookiecutter is a wrapper around a Jinja file templates; `create` allows for full JavaScript logic to generate contents based on provided options
- Cookiecutter always operates at the scale of one template; `create` provides more granular APIs for areas of features (Blocks and Presets)
- Cookiecutter supports file changes; `create` additionally supports network calls and arbitrary shell scripts as outputs

Cookiecutter is also written in Python and is installed using tools in the Python ecosystem.
`create` is written in TypeScript and is set up to work in the web ecosystem.

### copier

[Copier](https://copier.readthedocs.io/en/latest) is a library and CLI app for generating projects from templates.
It takes in a local path or Git URL and dynamically replaces values in text files.

`create` has several key additions on top of what Copier supports:

- Copier is a wrapper around a straightforward file templates; `create` allows for dynamic logic for generating contents based on provided options
- Copier only supports file templates; `create` allows for sending network requests and running shell scripts
- Copier always operates at the scale of one template; `create` provides more granular APIs for areas of features (Blocks and Presets)

Copier is also written in Python and is installed using tools in the Python ecosystem.
`create` is written in TypeScript and is set up to work in the web ecosystem.

### degit

[degit](https://github.com/Rich-Harris/degit) is a tool that makes copies Git of repositories.
It allows for straightforward initialization of files, along with support for post-creation actions.

`create` has several key additions on top of what degit supports:

- degit is a wrapper around a straightforward `git clone`; `create` allows for dynamic logic for generating contents based on provided options
- degit only supports limited post-clone actions; `create` allows for sending network requests and running shell scripts
- degit always operates at the scale of a full repository; `create` provides more granular APIs for areas of features (Blocks and Presets)

### GitHub Template Repositories

[GitHub Template Repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) are a GitHub feature allowing making a new repository as a clone of another.
Created repositories appear on github.com with a _generated from ..._ notice.

`create` will include treating sources as templates, and additionally adds features:

- Template Repositories are a wrapper around a straightforward `git clone`; `create` allows for changing generated file contents based on provided options
- Template Repositories don't support post-clone actions; `create` allows for sending network requests and running shell scripts
- Template Repositories always operate at the scale of a full repository; `create` provides more granular APIs for areas of features (Blocks and Presets)

### Hygen

[Hygen](https://hygen.io) is web ecosystem tool for defining generators to automate common file system tasks.
It encourages building your own generators that include templates built with the [EJS](https://ejs.co) embedded JavaScript templating engine.
Hygen templates can have conditional rendering, embedded JavaScript, and injected shell scripts.

`create` takes a different architectural approach than Hygen:

- Hygen templates are imperative descriptions of files and frontmatter; `create` groups areas into blocks
- Hygen templates heavily build on EJS and do not have type-safe options; `create` has options explicitly defined with Zod schemas
- `create` Blocks describe their own outputs and additions to other Blocks, allowing them to be individually toggled

### Plop

[Plop](https://github.com/plopjs/plop) is web ecosystem tool for defining repository templates.
Like `create`, it allows defining templates for generated files.

`create` has several key differences from Plop:

- Plop is built around an imperative "actions" API for adding files, as opposed to `create`'s managing of outputs
- Plop only supports file creation, not other actions such as setting repository GitHub systems
- Plop is built on the popular Inquirer.js and Handlebars libraries, rather than `create`'s more type-safe Zod schema options

In other words, `create` is a more broadly scoped project for full repository generation, whereas Plop is more finely targeted to applying Handlebars templates.

### projen

[projen](https://github.com/projen/projen) is web ecosystem tool for defining repository templates.
It is similar to `create` in that it is a flexible underlying engine that allows developers define and manage project configurations through code.

`create` has several large differences from projen:

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

### Yeoman

[Yeoman](https://yeoman.io) is a much older tool in the web ecosystem for templating.
Its architecture and APIs generally work with older, now-outdated JavaScript practices:

- Project generators must extend `yeoman-generator`'s Generator and define methods that are dynamically discovered and called at runtime
- System interactions such as installing dependencies and writing files are done by imperatively calling Yeoman APIs, as opposed to producing outputs that are managed by `create`
- Persistent options are provided in a raw `.yo-rc.json` JSON file rather than type-safe schema definitions

Yeoman has not been actively maintained in several years.
