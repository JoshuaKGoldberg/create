import { Creation } from "../types/creations.js";
import { mergeArrays } from "./mergeArrays.js";
import { mergeDocumentation } from "./mergeDocumentation.js";
import { mergeEditor } from "./mergeEditor.js";
import { mergeFiles } from "./mergeFiles.js";
import { mergePackage } from "./mergePackage.js";

export function mergeCreations(
	first: Creation,
	second: Partial<Creation>,
): Creation {
	return {
		commands: mergeArrays(first.commands, second.commands),
		documentation: mergeDocumentation(
			first.documentation,
			second.documentation,
		),
		editor: mergeEditor(first.editor, second.editor),
		files: mergeFiles(first.files, second.files, []),
		jobs: mergeArrays(first.jobs, second.jobs),
		metadata: mergeArrays(first.metadata, second.metadata),
		package: mergePackage(first.package, second.package),
	};
}
