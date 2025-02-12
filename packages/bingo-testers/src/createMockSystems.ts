import { TakeInput } from "bingo";
import { NativeSystem } from "bingo-systems";

import { createMockFetchers } from "./createMockFetchers.js";
import { createMockFileSystem } from "./createMockFileSystem.js";
import { MockSystemOptions } from "./types.js";
import { createFailingFunction } from "./utils.js";

export interface MockSystems {
	system: NativeSystem;
	take: TakeInput;
}

export function createMockSystems(
	settings: MockSystemOptions = {},
): MockSystems {
	const fetchers = createMockFetchers(fetch);
	const fs = createMockFileSystem(settings.fs);
	const runner = settings.runner ?? createFailingFunction("runner", "an input");

	const system = { fetchers, fs, runner };

	const take =
		settings.take ??
		(((input, args) => input({ args, take, ...system })) as TakeInput);

	return { system, take };
}
