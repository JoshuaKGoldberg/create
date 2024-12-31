import * as prompts from "@clack/prompts";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { findPositionalFrom } from "../findPositionalFrom.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForBaseOptions } from "../prompts/promptForBaseOptions.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { clearTemplateFiles } from "./clearTemplateFiles.js";
import { getForkedTemplateLocator } from "./getForkedTemplateLocator.js";
import { tryLoadMigrationPreset } from "./tryLoadMigrationPreset.js";

export interface RunModeMigrateSettings {
	args: string[];
	configFile: string | undefined;
	directory?: string;
	display: ClackDisplay;
	from?: string;
	preset?: string | undefined;
}

export async function runModeMigrate({
	args,
	configFile,
	directory = ".",
	display,
	from = findPositionalFrom(args),
	preset: requestedPreset,
}: RunModeMigrateSettings): Promise<ModeResults> {
	const loaded = await tryLoadMigrationPreset({
		configFile,
		directory,
		from,
		requestedPreset,
	});
	if (loaded instanceof Error) {
		return {
			outro: loaded.message,
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(loaded)) {
		return { status: CLIStatus.Cancelled };
	}

	const system = await createSystemContextWithAuth({ directory, display });

	const templateLocator =
		loaded.preset.base.template &&
		(await getForkedTemplateLocator(directory, loaded.preset.base.template));

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
		base: loaded.preset.base,
		existingOptions: parseZodArgs(args, loaded.preset.base.options),
		system,
	});
	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	await runSpinnerTask(
		display,
		`Running the ${loaded.preset.about.name} preset`,
		`Ran the ${loaded.preset.about.name} preset`,
		async () => {
			await runPreset(loaded.preset, {
				...loaded.settings,
				...system,
				directory,
				mode: "migrate",
				options,
			});
		},
	);

	let outro: string;

	if (templateLocator) {
		outro = `You might want to commit any changes.`;
		await runSpinnerTask(
			display,
			"Creating initial commit",
			"Created initial commit",
			async () => {
				await createInitialCommit(system.runner, true);
			},
		);
	} else {
		outro = `Done!`;
	}

	return {
		directory,
		from,
		options,
		outro,
		status: CLIStatus.Success,
		system,
	};
}
