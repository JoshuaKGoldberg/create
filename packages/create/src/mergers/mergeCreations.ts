import { Creation } from "../types/creations.js";
import { mergeArrays } from "./mergeArrays.js";
import { mergeFiles } from "./mergeFiles.js";
import { mergePackages } from "./mergePackages.js";
import { mergeScripts } from "./mergeScripts.js";
import { removeEmptyEntries } from "./removeEmptyEntries.js";

export function mergeCreations(creations: Creation[]): Creation {
	let result = creations[0];

	for (const creation of creations.slice(1)) {
		result = {
			commands: mergeArrays(result.commands, creation.commands),
			debuggers: mergeArrays(result.debuggers, creation.debuggers),
			documentation: mergeScripts(result.documentation, creation.documentation),
			extensions: mergeArrays(result.extensions, creation.extensions),
			files: mergeFiles(result.files, creation.files, []),
			metadata: mergeArrays(result.metadata, creation.metadata),
			packages: mergePackages(result.packages, creation.packages),
			scripts: mergeScripts(result.scripts, creation.scripts),
		};
	}

	return removeEmptyEntries(result);
}
