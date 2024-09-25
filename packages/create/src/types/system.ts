import { execa } from "execa";

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

// todo: don't allow end-users to stub in take
export interface System extends ContextBase {
	fetcher: typeof fetch;
	fs: WritingFileSystem;
	runner: typeof execa;
}
