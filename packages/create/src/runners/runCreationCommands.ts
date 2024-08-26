import { CreationContext } from "../shared";

export async function runCreationCommands(
	commands: string[],
	context: CreationContext,
) {
	for (const command of commands) {
		await context.runner(command);
	}
}
