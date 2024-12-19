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
						// TODO: Handle in-progress outputs better, in some way?
						console.log("Running script:", script);
						await runner(script);
						console.log("Done with script:", script);
					} catch (error) {
						// TODO: Handle errors better, in some way?
						console.error("Error in script", script, (error as Error).message);
					}
				}
			}),
		);
	}

	await commandsStandaloneTask;
}
