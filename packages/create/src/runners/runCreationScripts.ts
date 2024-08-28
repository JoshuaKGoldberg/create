import { CreationContextWithoutOptions } from "../types/context";
import { CreatedScripts } from "../types/creations";

interface PackageData {
	scripts?: Record<string, string>;
}

export async function runCreationScripts(
	scripts: CreatedScripts,
	context: CreationContextWithoutOptions,
) {
	const packageData = JSON.parse(
		(await context.fs.readFile("package.json")) || "{}",
	) as PackageData;

	await context.fs.writeFile(
		"package.json",
		JSON.stringify(
			{
				...packageData,
				scripts: {
					...packageData.scripts,
					...scripts,
				},
			},
			null,
			2,
		),
	);
}
