<h1 align="center">input-from-file-json</h1>

<p align="center">Bingo input that reads a file as JSON.</p>

<p align="center">
	<a href="https://github.com/JoshuaKGoldberg/bingo/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://github.com/JoshuaKGoldberg/bingo/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/input-from-file-json"><img alt="📦 npm version" src="https://img.shields.io/npm/v/input-from-file-json?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

```shell
npm i input-from-file-json
```

```ts
import { inputFromFileJSON } from "input-from-file-json";

await take(inputFromFileJSON, { filePath: "data.json" });
```

## Options

`inputFromFileJSON` takes a single argument, `filePath`, of type `string`.

It reads the `filePath` from disk and returns either:

- [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error): If an error was caught reading or parsing the file
- `unknown`: The result of running `JSON.parse` on the file's text contents

See **[create.bingo > Templates > Concepts > Inputs](https://create.bingo/build/concepts/inputs)** for more documentation on Inputs.
