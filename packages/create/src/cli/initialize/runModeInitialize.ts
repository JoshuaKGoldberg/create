import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { createClackDisplay } from "../display/createClackDisplay.js";
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
	from?: string;
	preset?: string;
	repository?: string;
}

export async function runModeInitialize({
	args,
	repository,
	directory: requestedDirectory = repository,
	from = findPositionalFrom(args),
	preset: requestedPreset,
}: RunModeInitializeSettings): Promise<ModeResults> {
	if (!from) {
		return {
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		};
	}

	prompts.log.message(
		[
			"Running with mode --create for a new repository using the template:",
			`  ${chalk.green(from)}`,
		].join("\n"),
	);

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

	const display = createClackDisplay();
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

	prompts.log.message(
		[
			"Great, you've got a new repository ready to use in:",
			`  ${chalk.green(makeRelative(directory))}`,
			"",
			"It's also pushed to GitHub on:",
			`  ${chalk.green(`https://github.com/${options.owner}/${options.repository}`)}`,
		].join("\n"),
	);

	return {
		outro: `Thanks for using ${chalk.bgGreenBright.black("create")}! 💝`,
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
	};
}
