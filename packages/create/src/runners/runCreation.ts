import { CreationContextWithoutOptions } from "../types/context";
import { Creation } from "../types/creations";
import { runCreationCommands } from "./runCreationCommands";
import { runCreationFiles } from "./runCreationFiles";
import { runCreationPackages } from "./runCreationPackages";
import { runCreationScripts } from "./runCreationScripts";

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
