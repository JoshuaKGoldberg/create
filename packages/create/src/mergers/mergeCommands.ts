import { CreatedScript } from "../types/creations.js";

export function mergeCommands(
	first: CreatedScript[] | undefined,
	second: CreatedScript[] | undefined,
): CreatedScript[] | undefined {
	if (!first) {
		return second;
	}

	if (!second) {
		return first;
	}

	const commandsByPhase = new Map<number, string[][]>();

	for (const command of [...first, ...second]) {
		const byPhase = commandsByPhase.get(command.phase);
		if (!byPhase) {
			commandsByPhase.set(command.phase, [command.commands.slice()]);
			continue;
		}

		for (const existing of byPhase) {
			if (existing.length <= command.commands.length) {
				if (firstHasSameStart(existing, command.commands)) {
					existing.push(...command.commands.slice(existing.length));
				} else {
					byPhase.push(command.commands);
				}
			} else if (!firstHasSameStart(command.commands, existing)) {
				byPhase.push(command.commands);
			}
		}
	}

	return Array.from(commandsByPhase).flatMap(([phase, phaseCommands]) =>
		phaseCommands.map((commands) => ({ commands, phase })),
	);
}

function firstHasSameStart(first: string[], second: string[]) {
	return first.every((entry, i) => entry === second[i]);
}
