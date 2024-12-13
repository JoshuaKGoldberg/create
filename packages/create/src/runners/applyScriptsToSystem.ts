import { CreatedScript } from "../types/creations.js";
import { SystemRunner } from "../types/system.js";
import { groupBy } from "../utils/groupBy.js";

export async function applyScriptsToSystem(
	scripts: CreatedScript[],
	runner: SystemRunner,
) {
	const commandsByPhase = groupBy(scripts, (command) => command.phase);

	const phaseKeys = Object.keys(commandsByPhase)
		.map((key) => Number(key))
		.sort();

	for (const phase of phaseKeys) {
		await Promise.all(
			commandsByPhase[phase].map(async (command) => {
				for (const script of command.commands) {
					await runner(script);
				}
			}),
		);
	}
}
