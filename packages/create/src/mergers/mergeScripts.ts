import { CreatedScripts } from "../shared";

export function mergeScripts(
	first: CreatedScripts | undefined,
	second: CreatedScripts | undefined,
) {
	if (!first) {
		return second;
	}

	if (!second) {
		return first;
	}

	for (const i in first) {
		if (i in second && first[i] !== second[i]) {
			throw new Error(
				`Conflicting script for "${i}": "${first[i]}" vs. "${second[i]}"`,
			);
		}
	}

	return {
		...first,
		...second,
	};
}
