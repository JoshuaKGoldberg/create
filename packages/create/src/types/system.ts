import { Result } from "execa";

import { TakeContext } from "./context.js";
import { InputFileSystem } from "./inputs.js";

export type FileSystemWriteDirectory = (directoryPath: string) => Promise<void>;

export type FileSystemWriteFile = (
	filePath: string,
	contents: string,
	options?: FileSystemWriteFileOptions,
) => Promise<void>;

export interface FileSystemWriteFileOptions {
	mode?: number;
}

export interface NativeSystem {
	fetcher: typeof fetch;
	fs: WritingFileSystem;
	runner: SystemRunner;
}

export interface SystemContext extends NativeSystem, TakeContext {
	directory: string;
}

export type SystemRunner = (command: string) => Promise<Result>;

export interface WritingFileSystem extends InputFileSystem {
	writeDirectory: FileSystemWriteDirectory;
	writeFile: FileSystemWriteFile;
}
