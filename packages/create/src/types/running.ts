import { execa } from "execa";

import { ContextBase } from "./context.js";
import { InputFileSystem } from "./inputs.js";

export type FileSystemWriteFile = (
	filePath: string,
	contents: string,
) => Promise<void>;

export interface RunningFileSystem extends InputFileSystem {
	writeFile: FileSystemWriteFile;
}

export interface RunningContext extends ContextBase {
	fetcher: typeof fetch;
	fs: RunningFileSystem;
	runner: typeof execa;
}
