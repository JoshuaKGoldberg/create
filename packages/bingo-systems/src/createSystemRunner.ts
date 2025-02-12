import { execa, parseCommandString } from "execa";

import { SystemRunner } from "./types.js";

export function createSystemRunner(directory: string): SystemRunner {
	const executor = execa({ cwd: directory, reject: false });

	return (command: string) => executor`${parseCommandString(command)}`;
}
