import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { createClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { findPositionalFrom } from "../findPositionalFrom.js";
import { applyArgsToSettings } from "../parsers/applyArgsToSettings.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForBaseOptions } from "../prompts/promptForBaseOptions.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { clearTemplateFiles } from "./clearTemplateFiles.js";
import { getForkedTemplateLocator } from "./getForkedTemplateLocator.js";
import { parseMigrationSource } from "./parseMigrationSource.js";

export interface RunModeMigrateSettings {
	args: string[];
	configFile: string | undefined;
	directory?: string;
	from?: string;
	preset?: string | undefined;
}

export async function runModeMigrate({
	args,
	configFile,
	directory = ".",
	from = findPositionalFrom(args),
	preset: requestedPreset,
}: RunModeMigrateSettings): Promise<ModeResults> {
	const source = parseMigrationSource({
		configFile,
		directory,
		from,
		requestedPreset,
	});
	if (source instanceof Error) {
		return {
			outro: source.message,
			status: CLIStatus.Error,
		};
	}

	prompts.log.message(
		[
			`Running with --mode migrate for an existing repository using the ${source.type}:`,
			`  ${chalk.green(source.descriptor)}`,
		].join("\n"),
	);

	const loaded = await source.load();
	if (loaded instanceof Error) {
		return {
			outro: loaded.message,
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(loaded)) {
		return { status: CLIStatus.Cancelled };
	}

	const { preset, settings } = loaded;
	const display = createClackDisplay();
	const system = await createSystemContextWithAuth({ directory, display });

	const templateLocator =
		preset.base.template &&
		(await getForkedTemplateLocator(directory, preset.base.template));

	if (templateLocator) {
		await runSpinnerTask(
			display,
			`Clearing from ${templateLocator}`,
			`Cleared from ${templateLocator}`,
			async () => {
				await clearTemplateFiles(directory);
				await clearLocalGitTags(system.runner);
			},
		);
	}

	const options = await promptForBaseOptions({
		base: preset.base,
		existingOptions: {
			...settings?.options,
			...parseZodArgs(args, preset.base.options),
		},
		system,
	});
	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	const mergedSettings = applyArgsToSettings(args, preset, settings);
	if (mergedSettings instanceof Error) {
		return { outro: mergedSettings.message, status: CLIStatus.Error };
	}

	await runSpinnerTask(
		display,
		`Running the ${preset.about.name} preset`,
		`Ran the ${preset.about.name} preset`,
		async () => {
			await runPreset(preset, {
				...mergedSettings,
				...system,
				directory,
				mode: "migrate",
				options,
			});
		},
	);

	if (templateLocator) {
		await runSpinnerTask(
			display,
			"Creating initial commit",
			"Created initial commit",
			async () => {
				await createInitialCommit(system.runner, true);
			},
		);

		return {
			outro: `Done. Enjoy your new repository! 💝`,
			status: CLIStatus.Success,
		};
	}

	return {
		outro: `Done. Enjoy your updated repository! 💝`,
		status: CLIStatus.Success,
	};
}
