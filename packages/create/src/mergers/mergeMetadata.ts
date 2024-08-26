import { CreatedMetadata } from "../metadata";
import { mergeArrays } from "./mergeArrays";
import { mergeScripts } from "./mergeScripts";
import { removeEmptyEntries } from "./removeEmptyEntries";

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
