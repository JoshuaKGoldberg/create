import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { findPositionalFrom } from "../findPositionalFrom.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForBaseOptions } from "../prompts/promptForBaseOptions.js";
import { promptForInitializationDirectory } from "../prompts/promptForInitializationDirectory.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { makeRelative } from "../utils.js";
import { assertOptionsForInitialize } from "./assertOptionsForInitialize.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";

export interface RunModeInitializeSettings {
	args: string[];
	directory?: string;
	display: ClackDisplay;
	from?: string;
	preset?: string;
	repository?: string;
}

export async function runModeInitialize({
	args,
	repository,
	directory: requestedDirectory = repository,
	display,
	from = findPositionalFrom(args),
	preset: requestedPreset,
}: RunModeInitializeSettings): Promise<ModeResults> {
	const loaded = await tryImportTemplatePreset(from, requestedPreset);
	if (loaded instanceof Error) {
		return {
			outro: loaded.message,
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(loaded)) {
		return {
			status: CLIStatus.Cancelled,
		};
	}

	const directory = await promptForInitializationDirectory(
		requestedDirectory,
		loaded.template,
	);
	if (prompts.isCancel(directory)) {
		return {
			status: CLIStatus.Cancelled,
		};
	}

	const system = await createSystemContextWithAuth({ directory, display });

	const options = await promptForBaseOptions({
		base: loaded.preset.base,
		existingOptions: parseZodArgs(args, loaded.preset.base.options),
		system,
	});
	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	assertOptionsForInitialize(options);

	await runSpinnerTask(
		display,
		"Creating repository on GitHub",
		"Created repository on GitHub",
		async () => {
			await createRepositoryOnGitHub(
				options,
				system.fetchers.octokit,
				loaded.preset.base.template,
			);
		},
	);

	const creation = await runSpinnerTask(
		display,
		`Running the ${loaded.preset.about.name} preset`,
		`Ran the ${loaded.preset.about.name} preset`,
		async () =>
			await runPreset(loaded.preset, {
				...system,
				directory,
				mode: "initialize",
				options,
			}),
	);

	await runSpinnerTask(
		display,
		"Preparing local repository",
		"Prepared local repository",
		async () => {
			await createTrackingBranches(options, system.runner);
			await createInitialCommit(system.runner);
			await clearLocalGitTags(system.runner);
		},
	);

	return {
		directory,
		from,
		options,
		outro: [
			chalk.blue("Your new repository is ready in:"),
			chalk.green(makeRelative(directory)),
		].join(" "),
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
		system,
	};
}
