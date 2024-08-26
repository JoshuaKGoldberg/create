import { CreatedPackages, CreationContext } from "../shared";

export async function runCreationPackages(
	packages: CreatedPackages,
	context: CreationContext,
) {
	for (const [key, suffix] of [
		["dependencies", ""],
		["devDependencies", " --save-dev"],
		["peerDependencies", " --save-peer"],
	] as const) {
		if (!packages[key]) {
			continue;
		}

		const args = Object.entries(packages[key])
			.map((pair) => pair.join("@"))
			.join(" ");

		await context.runner(`pnpm add ${args}${suffix}`);
	}
}
