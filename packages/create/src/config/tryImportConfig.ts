import { isCreateConfig } from "../predicates/isCreateConfig.js";
import { tryImportWithPredicate } from "../predicates/tryImportWithPredicate.js";

export async function tryImportConfig(
	configFile: string,
	importer: (moduleName: string) => Promise<object>,
) {
	return await tryImportWithPredicate(
		importer,
		configFile,
		isCreateConfig,
		"config from createConfig().",
	);
}
