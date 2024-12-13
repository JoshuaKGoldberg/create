import { execa, parseCommandString } from "execa";

export function createSystemRunner(directory: string) {
	const executor = execa({ cwd: directory });

	return (command: string) => executor`${parseCommandString(command)}`;
}
