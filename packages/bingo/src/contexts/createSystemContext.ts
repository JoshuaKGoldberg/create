import {
	createOfflineFetchers,
	createSystemDisplay,
	createSystemFetchers,
	createSystemRunner,
	createWritingFileSystem,
	NativeSystem,
	SystemDisplay,
} from "bingo-systems";

import { TakeInput } from "../types/inputs.js";

export interface SystemContextSettings extends Partial<NativeSystem> {
	auth?: string;
	directory: string;
	display?: SystemDisplay;
	offline?: boolean;
}

export function createSystemContext(settings: SystemContextSettings) {
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
