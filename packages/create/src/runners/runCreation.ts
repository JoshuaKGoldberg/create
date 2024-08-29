import { CreationContextWithoutOptions } from "../types/context.js";
import { Creation } from "../types/creations.js";
import { runCreationCommands } from "./runCreationCommands.js";
import { runCreationFiles } from "./runCreationFiles.js";
import { runCreationPackages } from "./runCreationPackages.js";
import { runCreationScripts } from "./runCreationScripts.js";

export async function runCreation(
	creation: Creation,
	context: CreationContextWithoutOptions,
) {
	if (creation.commands) {
		await runCreationCommands(creation.commands, context);
	}

	if (creation.files) {
		await runCreationFiles(creation.files, context);
	}

	if (creation.packages) {
		await runCreationPackages(creation.packages, context);
	}

	if (creation.scripts) {
		await runCreationScripts(creation.scripts, context);
	}
}
