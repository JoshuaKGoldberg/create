import { CreatedScript } from "../types/creations.js";
import { SystemContext } from "../types/system.js";
import { groupBy } from "../utils/groupBy.js";

export async function applyScriptsToSystem(
	scripts: CreatedScript[],
	system: Pick<SystemContext, "display" | "runner">,
) {
	const scriptsByPhase = groupBy(
		scripts.filter((script) => typeof script === "object"),
		(script) => script.phase,
	);
	const commandsStandalone = scripts.filter(
		(script) => typeof script === "string",
	);

	const phaseKeys = Object.keys(scriptsByPhase)
		.map((key) => Number(key))
		.sort();

	async function runCommand(command: string) {
		system.display.item("scripts", command, { start: Date.now() });
		const result = await system.runner(command);
		system.display.item("scripts", command, { end: Date.now() });

		if (result instanceof Error) {
			system.display.item("scripts", command, { error: result });
		}
	}

	const commandsStandaloneTask = Promise.all(
		commandsStandalone.map(runCommand),
	);

	for (const phase of phaseKeys) {
		await Promise.all(
			scriptsByPhase[phase].map(async (script) => {
				for (const command of script.commands) {
					await runCommand(command);
				}
			}),
		);
	}

	await commandsStandaloneTask;
}
