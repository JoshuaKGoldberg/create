import { CreatedPackage } from "../types/creations.js";
import { RunningContext } from "../types/running.js";

export async function runCreationPackage(
	createdPackage: CreatedPackage,
	context: RunningContext,
) {
	for (const [key, suffix] of [
		["dependencies", ""],
		["devDependencies", " --save-dev"],
		["peerDependencies", " --save-peer"],
	] as const) {
		if (!createdPackage[key]) {
			continue;
		}

		const args = Object.entries(createdPackage[key])
			.map((pair) => pair.join("@"))
			.join(" ");

		await context.runner(`pnpm add ${args}${suffix}`);
	}
}
