import { NativeSystem, TakeInput } from "create";
import { WritingFileSystem } from "create-fs";
import { Octokit } from "octokit";

import { MockSystemOptions } from "./types.js";
import { createFailingFunction } from "./utils.js";

export interface MockSystems {
	system: NativeSystem;
	take: TakeInput;
}

export function createMockSystems(
	settings: MockSystemOptions = {},
): MockSystems {
	const fetch = settings.fetch ?? createFailingFunction("fetch", "an input");

	const fetchers = {
		fetch,
		octokit: new Octokit({ request: fetch }),
	};

	const fs: WritingFileSystem = {
		readDirectory: createFailingFunction("fs.readDirectory", "an input"),
		readFile: createFailingFunction("fs.readFile", "an input"),
		writeDirectory: createFailingFunction("fs.writeDirectory", "an input"),
		writeFile: createFailingFunction("fs.writeFile", "an input"),
		...settings.fs,
	};

	const runner = settings.runner ?? createFailingFunction("runner", "an input");

	const system = { fetchers, fs, runner };

	const take =
		settings.take ??
		(((input, args) => input({ args, take, ...system })) as TakeInput);

	return { system, take };
}
