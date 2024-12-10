<h1 align="center">input-from-file-json</h1>

<p align="center"><code>create</code> input that reads a file as JSON.</p>

<p align="center">
	<a href="https://github.com/JoshuaKGoldberg/input-from-file-json/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/input-from-file-json" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/input-from-file-json?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/input-from-file-json/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/input-from-file-json"><img alt="📦 npm version" src="https://img.shields.io/npm/v/input-from-file-json?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

```shell
npm i input-from-file-json
```

```ts
import { inputFileJSON } from "input-from-file-json";

await take(inputFileJSON, { filePath: "data.json" });
```

## Options

`inputFileJSON` takes a single argument, `filePath`, of type `string`.

See **[create-josh.vercel.app > Engine > Runtime > Inputs](https://create-josh.vercel.app/engine/runtime/inputs)** for more documentation on Inputs.
