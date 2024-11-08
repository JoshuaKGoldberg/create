import { NativeSystem, TakeInput, WritingFileSystem } from "create";

import { createFailingFunction } from "./utils.js";

export function createMockSystems(settings: Partial<NativeSystem> = {}) {
	const fetcher =
		settings.fetcher ?? createFailingFunction("fetcher", "an input");

	const fs: WritingFileSystem = {
		readFile: createFailingFunction("fs.readFile", "an input"),
		writeDirectory: createFailingFunction("fs.writeDirectory", "an input"),
		writeFile: createFailingFunction("fs.writeFile", "an input"),
		...settings.fs,
	};

	const runner = settings.runner ?? createFailingFunction("runner", "an input");

	const system = { fetcher, fs, runner };

	const take = ((input, args) => input({ args, take, ...system })) as TakeInput;

	return { system, take };
}
