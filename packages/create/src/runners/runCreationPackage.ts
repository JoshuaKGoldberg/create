import { CreatedPackage } from "../types/creations.js";
import { SystemContext } from "../types/system.js";

export async function runCreationPackage(
	createdPackage: CreatedPackage,
	system: SystemContext,
) {
	await system.fs.writeFile("package.json", JSON.stringify(createdPackage));

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

		await system.runner(`pnpm add ${args}${suffix}`);
	}
}
