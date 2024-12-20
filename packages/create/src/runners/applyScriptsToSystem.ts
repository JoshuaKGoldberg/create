import { logError } from "../cli/loggers/logError.js";
import { CreatedScript } from "../types/creations.js";
import { SystemRunner } from "../types/system.js";
import { groupBy } from "../utils/groupBy.js";

export async function applyScriptsToSystem(
	scripts: CreatedScript[],
	runner: SystemRunner,
) {
	const commandsByPhase = groupBy(
		scripts.filter((script) => typeof script === "object"),
		(script) => script.phase,
	);
	const commandsStandalone = scripts.filter(
		(script) => typeof script === "string",
	);

	const phaseKeys = Object.keys(commandsByPhase)
		.map((key) => Number(key))
		.sort();

	const commandsStandaloneTask = Promise.all(
		commandsStandalone.map(async (command) => await runner(command)),
	);

	for (const phase of phaseKeys) {
		await Promise.all(
			commandsByPhase[phase].map(async (command) => {
				for (const script of command.commands) {
					try {
						await runner(script);
					} catch (error) {
						logError(`Error running ${script}:`, error);
					}
				}
			}),
		);
	}

	await commandsStandaloneTask;
}
