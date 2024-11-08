import { execa, parseCommandString } from "execa";
import * as nodeFS from "node:fs/promises";

import { TakeInput } from "../types/inputs.js";
import { NativeSystem } from "../types/system.js";

export interface NativeSystems {
	system: NativeSystem;
	take: TakeInput;
}

export function createNativeSystems(
	providedSystem: Partial<NativeSystem> = {},
): NativeSystems {
	const system = {
		fetcher: providedSystem.fetcher ?? fetch,
		fs: providedSystem.fs ?? {
			readFile: async (filePath: string) =>
				(await nodeFS.readFile(filePath)).toString(),
			writeDirectory: async (directoryPath: string) =>
				void (await nodeFS.mkdir(directoryPath, { recursive: true })),
			writeFile: async (filePath: string, contents: string) => {
				await nodeFS.writeFile(filePath, contents);
			},
		},
		runner:
			providedSystem.runner ??
			(async (command: string) => await execa`${parseCommandString(command)}`),
	};

	const take = ((input, args) => input({ args, take, ...system })) as TakeInput;

	return { system, take };
}
