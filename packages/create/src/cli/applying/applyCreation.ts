import { createNativeSystems } from "../../system/createNativeSystems.js";
import { DirectCreation } from "../../types/creations.js";
import { applyFilesToSystem } from "./applyFilesToSystem.js";

export async function applyCreation(
	creation: DirectCreation,
	rootDirectory: string,
) {
	const { system } = createNativeSystems();

	await applyFilesToSystem(creation.files, system.fs, rootDirectory);
}
