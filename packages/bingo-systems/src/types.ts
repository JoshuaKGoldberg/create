import { ExecaError, Result } from "execa";
import { Octokit } from "octokit";

export interface DirectoryChild {
	name: string;
	type: "directory" | "file";
}

export interface NativeSystem {
	fetchers: SystemFetchers;
	fs: WritingFileSystem;
	runner: SystemRunner;
}

export type ReadDirectory = (filePath: string) => Promise<string[]>;

export type ReadFile = (filePath: string) => Promise<string>;

export interface ReadingFileSystem {
	readDirectory: ReadDirectory;
	readFile: ReadFile;
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

export type WriteDirectory = (directoryPath: string) => Promise<void>;

export type WriteFile = (
	filePath: string,
	contents: string,
	options?: WriteFileOptions,
) => Promise<void>;

export interface WriteFileOptions {
	executable?: boolean;
}

export interface WritingFileSystem extends ReadingFileSystem {
	writeDirectory: WriteDirectory;
	writeFile: WriteFile;
}
