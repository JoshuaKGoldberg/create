import { isCreateConfig } from "../predicates/isCreateConfig.js";
import { tryImportWithPredicate } from "../predicates/tryImportWithPredicate.js";

export async function tryImportConfig(configFile: string) {
	return await tryImportWithPredicate(
		async (moduleName) => (await import(moduleName)) as object,
		configFile,
		isCreateConfig,
		"config from createConfig().",
	);
}
