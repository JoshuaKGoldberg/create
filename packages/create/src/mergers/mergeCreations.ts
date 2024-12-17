import { Creation } from "../types/creations.js";
import { applyMerger } from "./applyMerger.js";
import { mergeAddons } from "./mergeAddons.js";
import { mergeFileCreations } from "./mergeFileCreations.js";
import { mergeRequests } from "./mergeRequests.js";
import { mergeScripts } from "./mergeScripts.js";

export function mergeCreations<Options extends object>(
	first: Partial<Creation<Options>>,
	second: Partial<Creation<Options>>,
): Partial<Creation<Options>> {
	return removeEmptyProperties({
		addons: applyMerger(first.addons, second.addons, mergeAddons),
		files: applyMerger(first.files, second.files, mergeFileCreations),
		requests: applyMerger(first.requests, second.requests, mergeRequests),
		scripts: applyMerger(first.scripts, second.scripts, mergeScripts),
	});
}

function removeEmptyProperties<T extends object>(value: T): T {
	for (const k in value) {
		if (value[k] === undefined) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete value[k];
		}
	}

	return value;
}
