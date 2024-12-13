import { execa, parseCommandString } from "execa";
import * as nodeFS from "node:fs/promises";

import { TakeInput } from "../types/inputs.js";
import { NativeSystem, SystemContext } from "../types/system.js";

export interface NativeSystems {
	system: NativeSystem;
	take: TakeInput;
}

export function createWritingFileSystem() {
	return {
		readFile: async (filePath: string) =>
			(await nodeFS.readFile(filePath)).toString(),
		writeDirectory: async (directoryPath: string) =>
			void (await nodeFS.mkdir(directoryPath, { recursive: true })),
		writeFile: async (filePath: string, contents: string) => {
			await nodeFS.writeFile(filePath, contents);
		},
	};
}

export function createSystemRunner(directory: string) {
	const executor = execa({ cwd: directory });

	return (command: string) => executor`${parseCommandString(command)}`;
}

export interface NativeSystemsSettings extends Partial<NativeSystem> {
	directory: string;
}

export function createNativeSystems(
	settings: NativeSystemsSettings,
): NativeSystems {
	const system = {
		fetcher: settings.fetcher ?? fetch,
		fs: settings.fs ?? createWritingFileSystem(),
		runner: settings.runner ?? createSystemRunner(settings.directory),
	};

	const take = ((input, args) => input({ args, take, ...system })) as TakeInput;

	return { system, take };
}

export function createSystemContext(
	settings: NativeSystemsSettings,
): SystemContext {
	const { system, take } = createNativeSystems(settings);

	return {
		...system,
		directory: settings.directory,
		take,
	};
}
