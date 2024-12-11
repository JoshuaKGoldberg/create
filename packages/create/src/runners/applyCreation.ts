import { DirectCreation } from "../types/creations.js";
import { SystemContext } from "../types/system.js";
import { applyFilesToSystem } from "./applyFilesToSystem.js";

export async function applyCreation(
	creation: Partial<DirectCreation>,
	system: SystemContext,
	rootDirectory = ".",
) {
	if (creation.files) {
		await applyFilesToSystem(creation.files, system.fs, rootDirectory);
	}

	// TODO(#22): Implement shell command execution
	// TODO(#23): Implement network request execution
}
