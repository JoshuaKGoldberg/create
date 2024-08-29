import { CreationContextWithoutOptions } from "../types/context.js";

export async function runCreationCommands(
	commands: string[],
	context: CreationContextWithoutOptions,
) {
	for (const command of commands) {
		await context.runner(command);
	}
}
