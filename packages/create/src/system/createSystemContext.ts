import { TakeInput } from "../types/inputs.js";
import { NativeSystem, SystemContext, SystemDisplay } from "../types/system.js";
import { createSystemDisplay } from "./createSystemDisplay.js";
import { createSystemFetchers } from "./createSystemFetchers.js";
import { createSystemRunner } from "./createSystemRunner.js";
import { createWritingFileSystem } from "./createWritingFileSystem.js";

export interface SystemContextSettings extends Partial<NativeSystem> {
	auth?: string;
	directory: string;
	display?: SystemDisplay;
}

export function createSystemContext(
	settings: SystemContextSettings,
): SystemContext {
	const system: NativeSystem = {
		fetchers: settings.fetchers ?? createSystemFetchers(settings),
		fs: settings.fs ?? createWritingFileSystem(),
		runner: settings.runner ?? createSystemRunner(settings.directory),
	};

	const take = ((input, args) => input({ args, take, ...system })) as TakeInput;

	return {
		...system,
		directory: settings.directory,
		display: settings.display ?? createSystemDisplay(),
		take,
	};
}
