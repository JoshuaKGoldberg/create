import { Creation } from "../types/creations.js";
import { mergeAddons } from "./mergeAddons.js";
import { mergeArrays } from "./mergeArrays.js";
import { mergeFiles } from "./mergeFiles.js";
import { mergeMetadata } from "./mergeMetadata.js";

export function mergeCreations<Metadata, Options>(
	first: Creation<Metadata, Options>,
	second: Partial<Creation<Metadata, Options>>,
): Creation<Metadata, Options> {
	return {
		addons: mergeAddons(first.addons, second.addons),
		commands: mergeArrays(first.commands, second.commands),
		files: mergeFiles(first.files, second.files, []),
		metadata: mergeMetadata(first.metadata, second.metadata),
	};
}
