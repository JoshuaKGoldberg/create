import { DirectCreation } from "../types/creations.js";
import { SystemContext } from "../types/system.js";
import { applyFilesToSystem } from "./applyFilesToSystem.js";
import { applyRequestsToSystem } from "./applyRequestsToSystem.js";
import { applyScriptsToSystem } from "./applyScriptsToSystem.js";

export async function applyCreation(
	creation: Partial<DirectCreation>,
	system: SystemContext,
) {
	if (creation.files) {
		await applyFilesToSystem(creation.files, system.fs, system.directory);
	}

	await Promise.all([
		creation.scripts && applyScriptsToSystem(creation.scripts, system.runner),
		creation.requests &&
			applyRequestsToSystem(creation.requests, system.fetchers),
	]);
}
