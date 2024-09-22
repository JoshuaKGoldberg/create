import { InputContext } from "../types/inputs.js";

export async function runCreationCommands(
	commands: string[],
	context: InputContext,
) {
	for (const command of commands) {
		await context.runner(command);
	}
}
