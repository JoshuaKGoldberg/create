import { Result } from "execa";

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

export interface SystemContext extends ContextBase {
	fetcher: typeof fetch;
	fs: WritingFileSystem;
	runner: SystemRunner;
}
