import { createWritingFileSystem } from "bingo-fs";

import { TakeInput } from "../types/inputs.js";
import { NativeSystem, SystemContext, SystemDisplay } from "../types/system.js";
import { createOfflineFetchers } from "./createOfflineFetchers.js";
import { createSystemDisplay } from "./createSystemDisplay.js";
import { createSystemFetchers } from "./createSystemFetchers.js";
import { createSystemRunner } from "./createSystemRunner.js";

export interface SystemContextSettings extends Partial<NativeSystem> {
	auth?: string;
	directory: string;
	display?: SystemDisplay;
	offline?: boolean;
}

export function createSystemContext(
	settings: SystemContextSettings,
): SystemContext {
	const system: NativeSystem = {
		fetchers:
			settings.fetchers ??
			(settings.offline
				? createOfflineFetchers()
				: createSystemFetchers(settings)),
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
