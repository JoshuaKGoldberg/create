import { Creation } from "../types/creations.js";
import { mergeAddons } from "./mergeAddons.js";
import { mergeArrays } from "./mergeArrays.js";
import { overrideFiles } from "./overrideFiles.js";

export function overrideCreations<Options extends object>(
	first: Creation<Options>,
	second: Partial<Creation<Options>>,
): Creation<Options> {
	return {
		addons: mergeAddons(first.addons, second.addons),
		commands: mergeArrays(first.commands, second.commands),
		files: overrideFiles(first.files, second.files, []),
	};
}
