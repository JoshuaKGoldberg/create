import chalk from "chalk";
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
			`${chalk.green("--mode migrate")} cannot combine an existing config file (${chalk.blue(configFile)}) with an explicit ${chalk.blue("--from")} (${chalk.blue(from)}).`,
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
		`Existing repository detected. To migrate an existing repository, either create a create.config file or provide the name or path of a template.`,
	);
}
