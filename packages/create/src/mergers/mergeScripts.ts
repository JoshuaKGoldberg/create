import { CreatedPackageScripts } from "../types/creations.js";

export function mergeScripts(
	first: CreatedPackageScripts,
	second: CreatedPackageScripts | undefined,
) {
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
