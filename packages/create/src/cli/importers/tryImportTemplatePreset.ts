import * as prompts from "@clack/prompts";

import { promptForPreset } from "../prompts/promptForPreset.js";
import { tryImportTemplate } from "./tryImportTemplate.js";

export async function tryImportTemplatePreset(
	from: string,
	requestedPreset?: string,
) {
	const template = await tryImportTemplate(from);
	if (template instanceof Error) {
		return template;
	}

	const preset = await promptForPreset(requestedPreset, template);
	if (prompts.isCancel(preset)) {
		return preset;
	}

	return { preset, template };
}
