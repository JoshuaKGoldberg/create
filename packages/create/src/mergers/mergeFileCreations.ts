import { CreatedFiles } from "../types/creations.js";
import { mergeFileEntries } from "./mergeFileEntries.js";

export function mergeFileCreations(
	firsts: CreatedFiles | undefined,
	seconds: CreatedFiles | undefined,
	path: string[],
) {
	if (!firsts) {
		return seconds;
	}

	if (!seconds) {
		return firsts;
	}

	const result: CreatedFiles = { ...firsts };

	for (const i in seconds) {
		const second = seconds[i];
		if (!(i in firsts)) {
			result[i] = second;
			continue;
		}

		const first = firsts[i];
		const nextPath = [...path, i];

		const firstIsDirectory = typeof first === "object" && !Array.isArray(first);
		const secondIsDirectory =
			typeof second === "object" && !Array.isArray(second);

		if (firstIsDirectory !== secondIsDirectory) {
			throw new Error(
				`Conflicting created directory and file at path: '${nextPath.join("/")}'.`,
			);
		}

		result[i] = firstIsDirectory
			? mergeFileCreations(first, second as CreatedFiles, nextPath)
			: mergeFileEntries(first, second, nextPath);
	}

	return result;
}
