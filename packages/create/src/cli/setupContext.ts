import { execa } from "execa";
import * as nodeFS from "node:fs/promises";

import { ContextFS, CreationContext, TakeInput } from "../shared";

export function setupContext(): CreationContext {
	const fetcher = fetch;

	const fs: ContextFS = {
		readFile: async (filePath: string) =>
			(await nodeFS.readFile(filePath)).toString(),
		writeFile: async (filePath: string, contents: string) => {
			await nodeFS.writeFile(filePath, contents);
		},
	};

	const runner = execa;

	const take: TakeInput = (input, options) =>
		input({ fetcher, fs, options, runner, take });

	return { fetcher, fs, runner, take };
}
