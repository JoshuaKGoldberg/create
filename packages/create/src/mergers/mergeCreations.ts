import { Creation } from "../shared";
import { mergeArrays } from "./mergeArrays";
import { mergeFiles } from "./mergeFiles";
import { mergeMetadata } from "./mergeMetadata";
import { mergePackages } from "./mergePackages";
import { mergeScripts } from "./mergeScripts";
import { removeEmptyEntries } from "./removeEmptyEntries";

export function mergeCreations(creations: Creation[]): Creation {
	let result = creations[0];

	for (const creation of creations.slice(1)) {
		result = {
			commands: mergeArrays(result.commands, creation.commands),
			files: mergeFiles(result.files, creation.files, []),
			metadata: mergeMetadata(result.metadata, creation.metadata),
			packages: mergePackages(result.packages, creation.packages),
			scripts: mergeScripts(result.scripts, creation.scripts),
		};
	}

	return removeEmptyEntries(result);
}
