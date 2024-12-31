import { tryImportConfig } from "../../config/tryImportConfig.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";

export interface MigrationLoadSettings {
	configFile?: string;
	from?: string;
	requestedPreset?: string;
}

export async function tryLoadMigrationPreset({
	configFile,
	from,
	requestedPreset,
}: MigrationLoadSettings) {
	if (configFile && from) {
		return new Error(
			"--mode migrate requires either a config file or a specified template, but not both.",
		);
	}

	if (configFile) {
		return await tryImportConfig(configFile);
	}

	if (from) {
		return await tryImportTemplatePreset(from, requestedPreset);
	}

	return new Error(
		"--mode migrate requires either a config file exist or a template be specified on the CLI.",
	);
}
