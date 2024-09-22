import { Creation } from "../types/creations.js";
import { RunningContext } from "../types/running.js";
import { runCreationCommands } from "./runCreationCommands.js";
import { runCreationFiles } from "./runCreationFiles.js";
import { runCreationPackage } from "./runCreationPackage.js";

export async function runCreation(creation: Creation, context: RunningContext) {
	await runCreationCommands(creation.commands, context);
	await runCreationFiles(creation.files, context);
	await runCreationPackage(creation.package, context);
}
