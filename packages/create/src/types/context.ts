import { execa } from "execa";

import { TakeInput } from "./inputs";

export interface CreationContextWithoutOptions {
	fetcher: typeof fetch;
	fs: ContextFS;
	runner: typeof execa;
	take: TakeInput;
}

export interface ContextFS {
	readFile: FSReadFile;
	writeFile: FSWriteFile;
}

export type FSReadFile = (filePath: string) => Promise<string>;

export type FSWriteFile = (filePath: string, contents: string) => Promise<void>;

export interface CreationContextWithOptions<Options>
	extends CreationContextWithoutOptions {
	options: Options;
}
