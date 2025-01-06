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
import { logStartText } from "../loggers/logStartText.js";
import { CLIMessage } from "../messages.js";
import { applyArgsToSettings } from "../parsers/applyArgsToSettings.js";
import { parseZodArgs } from "../parsers/parseZodArgs.js";
import { promptForBaseOptions } from "../prompts/promptForBaseOptions.js";
import { promptForDirectory } from "../prompts/promptForDirectory.js";
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
	help?: boolean;
	offline?: boolean;
	owner?: string;
	preset?: string;
	repository?: string;
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
}: RunModeInitializeSettings): Promise<ModeResults> {
	if (!from || help) {
		return await logInitializeHelpText(from, help);
	}

	logStartText("initialize", from, "template", offline);

	const loaded = await tryImportTemplatePreset(from, requestedPreset);
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

	const options = await promptForBaseOptions(preset.base, {
		existingOptions: {
			directory,
			repository: repository ?? directory,
			...parseZodArgs(args, preset.base.options),
		},
		offline,
		system,
	});
	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	assertOptionsForInitialize(options);

	const settings = applyArgsToSettings(args, preset);
	if (settings instanceof Error) {
		return { outro: settings.message, status: CLIStatus.Error };
	}

	if (!offline) {
		await runSpinnerTask(
			display,
			"Creating repository on GitHub",
			"Created repository on GitHub",
			async () => {
				await createRepositoryOnGitHub(
					options,
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
				options,
			}),
	);

	await runSpinnerTask(
		display,
		"Preparing local repository",
		"Prepared local repository",
		async () => {
			await createTrackingBranches(options, system.runner);
			await createInitialCommit(system.runner, { offline });
			await clearLocalGitTags(system.runner);
		},
	);

	prompts.log.message(
		[
			"Great, you've got a new repository ready to use in:",
			`  ${chalk.green(makeRelative(directory))}`,
			...(offline
				? []
				: [
						"",
						"It's also pushed to GitHub on:",
						`  ${chalk.green(`https://github.com/${options.owner}/${options.repository}`)}`,
					]),
		].join("\n"),
	);

	return {
		outro: `Thanks for using ${chalk.bgGreenBright.black("create")}! 💝`,
		status: CLIStatus.Success,
		suggestions: creation.suggestions,
	};
}
