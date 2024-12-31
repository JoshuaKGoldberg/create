import path from "node:path";

import { tryImportConfig } from "../../config/tryImportConfig.js";
import { CreateConfig } from "../../config/types.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";

export interface MigrationLoadSettings {
	configFile?: string;
	directory: string;
	from?: string;
	requestedPreset?: string;
}

export async function tryLoadMigrationPreset({
	configFile,
	directory,
	from,
	requestedPreset,
}: MigrationLoadSettings): Promise<CreateConfig | Error | symbol> {
	if (configFile && from) {
		return new Error(
			"--mode migrate requires either a config file or a specified template, but not both.",
		);
	}

	if (configFile) {
		return await tryImportConfig(
			path.join(process.cwd(), directory, configFile),
		);
	}

	if (from) {
		return await tryImportTemplatePreset(from, requestedPreset);
	}

	return new Error(
		"--mode migrate requires either a config file exist or a template be specified on the CLI.",
	);
}
