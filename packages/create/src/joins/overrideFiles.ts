import { CreatedFileEntry, CreatedFiles } from "../types/creations.js";

export function overrideFiles(
	base: CreatedFiles | undefined,
	override: CreatedFiles | undefined,
	path: string[],
) {
	if (!base) {
		return override ?? {};
	}

	if (!override) {
		return base;
	}

	const result: CreatedFiles = { ...base };

	for (const i in override) {
		if (typeof base[i] !== "object" || typeof override[i] === "string") {
			result[i] = override[i];
		} else if (override[i]) {
			result[i] = overrideFiles(base[i], override[i], [...path, i]);
		}
	}

	return result;
}

function isBlankEntry(entry: CreatedFileEntry | undefined) {
	return entry === false || entry === undefined;
}
