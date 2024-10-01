import { writeToSystem } from "../system/writeToSystem.js";
import { Creation } from "../types/creations.js";
import { System } from "../types/system.js";
import { runCreationCommands } from "./runCreationCommands.js";
import { runCreationPackage } from "./runCreationPackage.js";

export async function runCreation(creation: Creation, system: System) {
	await writeToSystem(creation.files, system.fs);
	await runCreationCommands(creation.commands, system);
	await runCreationPackage(creation.package, system);
}
