import * as prompts from "@clack/prompts";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { logMigrateHelpText } from "../loggers/logMigrateHelpText.js";
import { logStartText } from "../loggers/logStartText.js";
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
	display: ClackDisplay;
	from?: string;
	help?: boolean;
	offline?: boolean;
	preset?: string | undefined;
}

export async function runModeMigrate({
	args,
	configFile,
	directory = ".",
	display,
	from,
	help,
	offline,
	preset: requestedPreset,
}: RunModeMigrateSettings): Promise<ModeResults> {
	const source = parseMigrationSource({
		configFile,
		directory,
		from,
		requestedPreset,
	});

	if (help) {
		return await logMigrateHelpText(source);
	}

	if (source instanceof Error) {
		return {
			outro: source.message,
			status: CLIStatus.Error,
		};
	}

	logStartText("migrate", source.descriptor, source.type, offline);

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
	const system = await createSystemContextWithAuth({
		directory,
		display,
		offline,
	});

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

	const options = await promptForBaseOptions(preset.base, {
		existingOptions: {
			...settings?.options,
			...parseZodArgs(args, preset.base.options),
		},
		offline,
		system,
	});
	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	const mergedSettings = applyArgsToSettings(args, preset, settings);
	if (mergedSettings instanceof Error) {
		return { outro: mergedSettings.message, status: CLIStatus.Error };
	}

	const creation = await runSpinnerTask(
		display,
		`Running the ${preset.about.name} preset`,
		`Ran the ${preset.about.name} preset`,
		async () =>
			await runPreset(preset, {
				...mergedSettings,
				...system,
				directory,
				mode: "migrate",
				offline,
				options,
			}),
	);
	if (creation instanceof Error) {
		return {
			outro: `Leaving changes to the local directory on disk. 👋`,
			status: CLIStatus.Error,
		};
	}

	if (templateLocator) {
		await runSpinnerTask(
			display,
			"Creating initial commit",
			"Created initial commit",
			async () => {
				await createInitialCommit(system.runner, { amend: true, offline });
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
