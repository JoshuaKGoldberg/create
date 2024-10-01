import { execa, Result, ResultPromise } from "execa";

import { ContextBase } from "./context.js";
import { InputFileSystem } from "./inputs.js";

export type FileSystemWriteFile = (
	filePath: string,
	contents: string,
) => Promise<void>;

export type FileSystemWriteDirectory = (directoryPath: string) => Promise<void>;

export interface WritingFileSystem extends InputFileSystem {
	writeDirectory: FileSystemWriteDirectory;
	writeFile: FileSystemWriteFile;
}

export type SystemRunner = (command: string) => Promise<Result>;

// todo: don't allow end-users to stub in take
// todo: dedupe with InputContext
export interface System extends ContextBase {
	fetcher: typeof fetch;
	fs: WritingFileSystem;
	runner: SystemRunner;
}
