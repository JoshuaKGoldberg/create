import { CreatedMetadata } from "../metadata.js";
import { mergeArrays } from "./mergeArrays.js";
import { mergeScripts } from "./mergeScripts.js";
import { removeEmptyEntries } from "./removeEmptyEntries.js";

export function mergeMetadata(
	first: CreatedMetadata | undefined,
	second: CreatedMetadata | undefined,
): CreatedMetadata | undefined {
	if (!first && !second) {
		return undefined;
	}

	return removeEmptyEntries({
		documentation: mergeScripts(first?.documentation, second?.documentation),
		files: mergeArrays(first?.files, second?.files),
	});
}
