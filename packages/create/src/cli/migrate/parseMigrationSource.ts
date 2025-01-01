import path from "node:path";

import { tryImportConfig } from "../../config/tryImportConfig.js";
import { CreateConfig } from "../../config/types.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";

export interface MigrationSource {
	descriptor: string;
	load: () => Promise<CreateConfig | Error | symbol>;
	type: "config file" | "template";
}

export interface RequestedMigrationSource {
	configFile?: string;
	directory: string;
	from?: string;
	requestedPreset?: string;
}

export function parseMigrationSource({
	configFile,
	directory,
	from,
	requestedPreset,
}: RequestedMigrationSource): Error | MigrationSource {
	if (configFile && from) {
		return new Error(
			"--mode migrate requires either a config file or a specified template, but not both.",
		);
	}

	if (configFile) {
		const absolutePath = path.join(process.cwd(), directory, configFile);
		return {
			descriptor: path.relative(process.cwd(), absolutePath),
			load: async () => await tryImportConfig(absolutePath),
			type: "config file",
		};
	}

	if (from) {
		return {
			descriptor: from,
			load: async () => await tryImportTemplatePreset(from, requestedPreset),
			type: "template",
		};
	}

	return new Error(
		"--mode migrate requires either a config file exist or a template be specified on the CLI.",
	);
}
