import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { findPositionalFrom } from "../findPositionalFrom.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForBaseOptions } from "../prompts/promptForBaseOptions.js";
import { promptForInitializationDirectory } from "../prompts/promptForInitializationDirectory.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { assertOptionsForInitialize } from "./assertOptionsForInitialize.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";

export interface RunModeInitializeSettings {
	args: string[];
	directory?: string;
	from?: string;
	preset?: string;
}

export async function runModeInitialize({
	args,
	directory: requestedDirectory,
	from = findPositionalFrom(args),
	preset: requestedPreset,
}: RunModeInitializeSettings): Promise<ModeResults> {
	if (!from) {
		return {
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		};
	}

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

	const presetDescription = `the ${loaded.preset.about.name} preset`;

	const creation = await runSpinnerTask(
		display,
		`Running ${presetDescription}`,
		`Ran ${presetDescription}`,
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
			await clearLocalGitTags(system.runner);
		},
	);

	return {
		outro: [
			chalk.blue("Your new repository is ready in:"),
			chalk.green(directory.startsWith(".") ? directory : `./${directory}`),
		].join(" "),
		status: CLIStatus.Error,
		suggestions: creation.suggestions,
	};
}
