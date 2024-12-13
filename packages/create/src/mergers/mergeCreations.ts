import { Creation } from "../types/creations.js";
import { mergeAddons } from "./mergeAddons.js";
import { mergeArrays } from "./mergeArrays.js";
import { mergeFileCreations } from "./mergeFileCreations.js";

export function mergeCreations<Options extends object>(
	first: Partial<Creation<Options>>,
	second: Partial<Creation<Options>>,
): Creation<Options> {
	return {
		addons: mergeAddons(first.addons, second.addons),
		files: mergeFileCreations(first.files, second.files, []) ?? {},
		scripts: mergeArrays(first.scripts, second.scripts),
	};
}
