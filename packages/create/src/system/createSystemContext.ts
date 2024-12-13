import { TakeInput } from "../types/inputs.js";
import { NativeSystem, SystemContext } from "../types/system.js";
import { createSystemRunner } from "./createSystemRunner.js";
import { createWritingFileSystem } from "./createWritingFileSystem.js";

export interface SystemContextSettings extends Partial<NativeSystem> {
	directory: string;
}

export function createSystemContext(
	settings: SystemContextSettings,
): SystemContext {
	const system = {
		fetcher: settings.fetcher ?? fetch,
		fs: settings.fs ?? createWritingFileSystem(),
		runner: settings.runner ?? createSystemRunner(settings.directory),
	};

	const take = ((input, args) => input({ args, take, ...system })) as TakeInput;

	return {
		...system,
		directory: settings.directory,
		take,
	};
}
