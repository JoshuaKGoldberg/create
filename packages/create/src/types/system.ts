import { ExecaError, Result } from "execa";
import { Octokit } from "octokit";

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
	fetchers: SystemFetchers;
	fs: WritingFileSystem;
	runner: SystemRunner;
}

export interface SystemContext extends NativeSystem, TakeContext {
	directory: string;
	display: SystemDisplay;
}

export interface SystemDisplay {
	item(group: string, id: string, item: Partial<SystemDisplayItem>): void;
	log(message: string): void;
}

export interface SystemDisplayItem {
	end?: number;
	error?: unknown;
	start?: number;
}

export interface SystemFetchers {
	fetch: typeof fetch;
	octokit: Octokit;
}

export type SystemRunner = (command: string) => Promise<ExecaError | Result>;

export interface WritingFileSystem extends InputFileSystem {
	writeDirectory: FileSystemWriteDirectory;
	writeFile: FileSystemWriteFile;
}
