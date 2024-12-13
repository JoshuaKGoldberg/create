import { Result } from "execa";

import { TakeContext } from "./context.js";
import { InputFileSystem } from "./inputs.js";

export interface FileSystemWriteFileOptions {
	mode?: number;
}

export type FileSystemWriteFile = (
	filePath: string,
	contents: string,
	options?: FileSystemWriteFileOptions,
) => Promise<void>;

export type FileSystemWriteDirectory = (directoryPath: string) => Promise<void>;

export interface WritingFileSystem extends InputFileSystem {
	writeDirectory: FileSystemWriteDirectory;
	writeFile: FileSystemWriteFile;
}

export type SystemRunner = (command: string) => Promise<Result>;

export interface NativeSystem {
	fetcher: typeof fetch;
	fs: WritingFileSystem;
	runner: SystemRunner;
}

export interface SystemContext extends NativeSystem, TakeContext {
	directory: string;
}
