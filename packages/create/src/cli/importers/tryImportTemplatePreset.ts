import * as prompts from "@clack/prompts";

import { promptForPreset } from "../prompts/promptForPreset.js";
import { tryImportTemplate } from "./tryImportTemplate.js";

export interface TemplatePresetImportSettings {
	from: string;
	requestedPreset: string | undefined;
	yes: boolean | undefined;
}

export async function tryImportTemplatePreset({
	from,
	requestedPreset,
	yes,
}: TemplatePresetImportSettings) {
	const template = await tryImportTemplate(from, yes);
	if (template instanceof Error) {
		return template;
	}

	const preset = await promptForPreset(requestedPreset, template);
	if (prompts.isCancel(preset)) {
		return preset;
	}

	return { preset, template };
}
