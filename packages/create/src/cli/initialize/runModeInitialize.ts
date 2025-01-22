import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { clearLocalGitTags } from "../clearLocalGitTags.js";
import { createInitialCommit } from "../createInitialCommit.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { runSpinnerTask } from "../display/runSpinnerTask.js";
import { tryImportTemplatePreset } from "../importers/tryImportTemplatePreset.js";
import { logInitializeHelpText } from "../loggers/logInitializeHelpText.js";
import { logRerunSuggestion } from "../loggers/logRerunSuggestion.js";
import { logStartText } from "../loggers/logStartText.js";
import { CLIMessage } from "../messages.js";
import { applyArgsToSettings } from "../parsers/applyArgsToSettings.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForBaseOptions } from "../prompts/promptForBaseOptions.js";
import { promptForDirectory } from "../prompts/promptForDirectory.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";
import { makeRelative } from "../utils.js";
import { createRepositoryOnGitHub } from "./createRepositoryOnGitHub.js";
import { createTrackingBranches } from "./createTrackingBranches.js";
import { getRepositoryLocator } from "./getRepositoryLocator.js";

export interface RunModeInitializeSettings {
	args: string[];
	directory?: string;
	display: ClackDisplay;
	from?: string;
	help?: boolean;
	offline?: boolean;
	owner?: string;
	preset?: string;
	repository?: string;
	yes?: boolean;
}

export async function runModeInitialize({
	args,
	repository,
	directory: requestedDirectory = repository,
	display,
	from,
	help,
	offline,
	preset: requestedPreset,
	yes,
}: RunModeInitializeSettings): Promise<ModeResults> {
	if (!from || help) {
		return await logInitializeHelpText(from, { help, yes });
	}

	logStartText("initialize", from, "template", offline);

	const loaded = await tryImportTemplatePreset({ from, requestedPreset, yes });
	if (loaded instanceof Error) {
		return {
			outro: chalk.red(CLIMessage.Exiting),
			status: CLIStatus.Error,
		};
	}
	if (prompts.isCancel(loaded)) {
		return { status: CLIStatus.Cancelled };
	}

	const { preset, template } = loaded;
	const directory = await promptForDirectory({
		requestedDirectory,
		requestedRepository: repository,
		template,
	});
	if (prompts.isCancel(directory)) {
		return { status: CLIStatus.Cancelled };
	}

	const system = await createSystemContextWithAuth({
		directory,
		display,
		offline,
	});

	const baseOptions = await promptForBaseOptions(preset.base, {
		existing: {
			directory,
			repository: repository ?? directory,
			...parseZodArgs(args, preset.base.options),
		},
		offline,
		system,
	});
	if (baseOptions.cancelled) {
		logRerunSuggestion(args, baseOptions.prompted);
		return { status: CLIStatus.Cancelled };
	}

	const locator = getRepositoryLocator(baseOptions.completed);

	const settings = applyArgsToSettings(args, preset);
	if (settings instanceof Error) {
		logRerunSuggestion(args, baseOptions.prompted);
		return { outro: settings.message, status: CLIStatus.Error };
	}

	if (!offline) {
		await runSpinnerTask(
			display,
			"Creating repository on GitHub",
			"Created repository on GitHub",
			async () => {
				await createRepositoryOnGitHub(
					locator,
					system.fetchers.octokit,
					preset.base.template,
				);
			},
		);
	}

	const creation = await runSpinnerTask(
		display,
		`Running the ${preset.about.name} preset`,
		`Ran the ${preset.about.name} preset`,
		async () =>
			await runPreset(preset, {
				...settings,
				...system,
				directory,
				mode: "initialize",
				offline,
				options: baseOptions.completed,
			}),
	);
	if (creation instanceof Error) {
		logRerunSuggestion(args, baseOptions.prompted);
		return {
			outro: `Leaving changes to the local directory on disk. 👋`,
			status: CLIStatus.Error,
		};
	}

	await runSpinnerTask(
		display,
		"Preparing local repository",
		"Prepared local repository",
		async () => {
			await createTrackingBranches(locator, system.runner);
			await createInitialCommit(system.runner, { offline });
			await clearLocalGitTags(system.runner);
		},
	);

	logRerunSuggestion(args, baseOptions.prompted);
	prompts.log.message(
		[
			"Great, you've got a new repository ready to use in:",
			`  ${chalk.green(makeRelative(directory))}`,
			...(offline
				? []
				: [
						"",
						"It's also pushed to GitHub on:",
						`  ${chalk.green(`https://github.com/${locator.owner}/${locator.repository}`)}`,
					]),
		].join("\n"),
	);

	return {
		outro: `Thanks for using ${chalk.bgGreenBright.black("create")}! 💝`,
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
	};
}
