import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { promptForPreset } from "../prompts/promptForPreset.js";
import { tryImportTemplate } from "./tryImportTemplate.js";

export async function tryImportTemplatePreset(
	from: string,
	requestedPreset?: string,
) {
	const spinner = prompts.spinner();
	spinner.start(`Loading ${chalk.blue(from)}`);

	const template = await tryImportTemplate(from);
	if (template instanceof Error) {
		spinner.stop(
			`Could not load ${chalk.blue(from)}: ${chalk.red(template.message)}`,
			1,
		);
		return template;
	}

	spinner.stop(`Loaded ${chalk.blue(from)}`);

	const preset = await promptForPreset(requestedPreset, template);
	if (prompts.isCancel(preset)) {
		return preset;
	}

	return { preset, template };
}
