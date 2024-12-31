import * as prompts from "@clack/prompts";

import { produceBase } from "../../producers/produceBase.js";
import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createClackDisplay } from "../display/createClackDisplay.js";
import { findPositionalFrom } from "../findPositionalFrom.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { clearTemplateFiles } from "./clearTemplateFiles.js";
import { getForkedTemplateLocator } from "./getForkedTemplateLocator.js";
import { loadMigrationPreset } from "./loadMigrationPreset.js";

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
	const loaded = await loadMigrationPreset({
		configFile,
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

	const display = createClackDisplay();

	const [templateDescription, system] = await Promise.all([
		loaded.preset.base.template &&
			getForkedTemplateLocator(directory, loaded.preset.base.template),
		createSystemContextWithAuth({ directory, display }),
	]);

	if (templateDescription) {
		display.spinner.start(`Clearing from ${templateDescription}...`);
		await clearTemplateFiles(directory);
		await clearLocalGitTags(system.runner);
		display.spinner.start(`Cleared from ${templateDescription}.`);
	}

	const presetDescription = `the ${loaded.preset.about.name} preset`;
	display.spinner.start(`Running ${presetDescription}...`);

	const options = await produceBase(loaded.preset.base, {
		...system,
		directory,
	});

	await runPreset(loaded.preset, {
		...system,
		directory,
		mode: "migrate",
		options,
	});

	display.spinner.stop(`Ran ${presetDescription}.`);

	return {
		outro: `You might want to commit any changes.`,
		status: CLIStatus.Success,
	};
}
