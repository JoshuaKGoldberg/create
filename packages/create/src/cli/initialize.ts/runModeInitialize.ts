import * as prompts from "@clack/prompts";

import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { SystemContext } from "../../types/system.js";
import { parseZodArgs } from "../parseZodArgs.js";
import { promptForInitializationDirectory } from "../promptForInitializationDirectory.js";
import { promptForPreset } from "../promptForPreset.js";
import { promptForPresetOptions } from "../promptForPresetOptions.js";
import { CLIStatus } from "../status.js";
import { tryImportTemplate } from "../tryImportTemplate.js";
import { findPositionalFrom } from "./findPositionalFrom.js";

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
}: RunModeInitializeSettings) {
	if (!from) {
		return {
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		};
	}

	const template = await tryImportTemplate(from);
	if (template instanceof Error) {
		return {
			outro: template.message,
			status: CLIStatus.Error,
		};
	}

	const preset = await promptForPreset(requestedPreset, template);
	if (prompts.isCancel(preset)) {
		return {
			status: CLIStatus.Cancelled,
		};
	}

	const directory = await promptForInitializationDirectory(
		requestedDirectory,
		template,
	);
	if (prompts.isCancel(directory)) {
		return {
			status: CLIStatus.Cancelled,
		};
	}

	const system = await createSystemContextWithAuth({ directory });
	const options = await promptForPresetOptions({
		base: preset.base,
		existingOptions: {
			repository: directory,
			...parseZodArgs(args, preset.base.options),
		},
		system,
	});

	if (prompts.isCancel(options)) {
		return { status: CLIStatus.Cancelled };
	}

	await runPreset(preset, {
		...system,
		directory,
		mode: "initialize",
		options,
	});

	return {
		outro: "TODO",
		status: CLIStatus.Error,
	};
}
