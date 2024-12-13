import { DirectCreation } from "../types/creations.js";
import { SystemContext } from "../types/system.js";
import { applyFilesToSystem } from "./applyFilesToSystem.js";
import { applyScriptsToSystem } from "./applyScriptsToSystem.js";

export async function applyCreation(
	creation: Partial<DirectCreation>,
	system: SystemContext,
) {
	if (creation.files) {
		await applyFilesToSystem(creation.files, system.fs, system.directory);
	}

	if (creation.scripts) {
		await applyScriptsToSystem(creation.scripts, system.runner);
	}

	// TODO(#23): Implement network request execution
}
