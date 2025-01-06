import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { CLIMessage } from "../messages.js";
import { MigrationSource } from "../migrate/parseMigrationSource.js";
import { CLIStatus } from "../status.js";
import { logHelpText } from "./logHelpText.js";

export async function logMigrateHelpText(source: Error | MigrationSource) {
	logHelpText("migrate", source);

	if (source instanceof Error) {
		return { outro: CLIMessage.Exiting, status: CLIStatus.Error };
	}

	const spinner = prompts.spinner();
	spinner.start(`Loading ${source.descriptor}`);

	const loaded = await source.load();

	if (loaded instanceof Error) {
		spinner.stop(
			`Could not load ${chalk.blue(source.descriptor)}: ${chalk.red(loaded.message)}`,
			1,
		);
		return { outro: CLIMessage.Exiting, status: CLIStatus.Error };
	}

	if (prompts.isCancel(loaded)) {
		return { status: CLIStatus.Cancelled };
	}

	spinner.stop(
		`Loaded ${chalk.blue(source.descriptor)}, which utilizes the ${chalk.blue(loaded.preset.about.name)} preset`,
	);

	return { outro: CLIMessage.Ok, status: CLIStatus.Success };
}
