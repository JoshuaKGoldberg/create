import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { Preset } from "../../types/presets.js";
import { Template } from "../../types/templates.js";
import { promptForPreset } from "../prompts/promptForPreset.js";
import { tryImportTemplate } from "./tryImportTemplate.js";

export interface TemplateAndPreset {
	preset: Preset;
	template: Template;
}

export async function tryImportTemplatePreset(
	from: string,
	requestedPreset?: string,
) {
	const spinner = prompts.spinner();
	spinner.start(`Loading ${from}`);

	const template = await tryImportTemplate(from);
	if (template instanceof Error) {
		spinner.stop(`Could not load ${from}: ${chalk.red(template.message)}`, 1);
		return template;
	}

	spinner.stop(`Loaded ${from}`);

	const preset = await promptForPreset(requestedPreset, template);
	if (prompts.isCancel(preset)) {
		return preset;
	}

	return { preset, template };
}
