import { Creation } from "../types/creations.js";
import { mergeAddons } from "./mergeAddons.js";
import { mergeArrays } from "./mergeArrays.js";
import { mergeFiles } from "./mergeFiles.js";

export function mergeCreations<Options>(
	first: Creation<Options>,
	second: Partial<Creation<Options>>,
): Creation<Options> {
	return {
		addons: mergeAddons(first.addons, second.addons),
		commands: mergeArrays(first.commands, second.commands),
		files: mergeFiles(first.files, second.files, []),
	};
}
