import { execa, parseCommandString } from "execa";
import * as nodeFS from "node:fs/promises";

import {
	NativeSystem,
	SystemRunner,
	WritingFileSystem,
} from "../types/system.js";

export function createNativeSystem(): NativeSystem {
	const fetcher = fetch;

	const fs: WritingFileSystem = {
		readFile: async (filePath: string) =>
			(await nodeFS.readFile(filePath)).toString(),
		writeDirectory: async (directoryPath: string) =>
			void (await nodeFS.mkdir(directoryPath, { recursive: true })),
		writeFile: async (filePath: string, contents: string) => {
			await nodeFS.writeFile(filePath, contents);
		},
	};

	const runner: SystemRunner = async (command: string) =>
		await execa`${parseCommandString(command)}`;

	return { fetcher, fs, runner };
}
