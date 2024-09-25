import { Creation } from "../types/creations.js";
import { System } from "../types/system.js";
import { runCreationCommands } from "./runCreationCommands.js";
import { runCreationFiles } from "./runCreationFiles.js";
import { runCreationPackage } from "./runCreationPackage.js";

export async function runCreation(creation: Creation, context: System) {
	await runCreationCommands(creation.commands, context);
	await runCreationFiles(creation.files, context);
	await runCreationPackage(creation.package, context);
}
