import { execa, parseCommandString } from "execa";
import * as nodeFS from "node:fs/promises";

import { TakeInput } from "../types/inputs.js";
import {
	SystemContext,
	SystemRunner,
	WritingFileSystem,
} from "../types/system.js";

export function createSystemContext(): SystemContext {
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

	const take: TakeInput = (input, args) =>
		input({ args, fetcher, fs, runner, take } as Parameters<TakeInput>[0]);

	return { fetcher, fs, runner, take };
}
