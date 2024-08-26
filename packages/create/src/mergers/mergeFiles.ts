import { CreatedFileEntry, CreatedFiles } from "../shared";

export function mergeFiles(
	first: CreatedFiles | undefined,
	second: CreatedFiles | undefined,
	path: string[],
): CreatedFiles | undefined {
	if (!first && !second) {
		return undefined;
	}

	if (!first) {
		return second;
	}

	if (!second) {
		return first;
	}

	const result: CreatedFiles = { ...first };

	for (const i in second) {
		if (isBlankEntry(second[i])) {
			continue;
		}

		if (!(i in first) || isBlankEntry(first[i])) {
			result[i] = second[i];
			continue;
		}

		if (typeof first[i] === "string" || typeof second[i] === "string") {
			throw new Error(`Duplicate created file: '${[...path, i].join(" > ")}'.`);
		}

		result[i] = mergeFiles(first[i], second[i], [...path, i]);
	}

	return result;
}

function isBlankEntry(entry: CreatedFileEntry | undefined) {
	return entry === false || entry === undefined;
}
