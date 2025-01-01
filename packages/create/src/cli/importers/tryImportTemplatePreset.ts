import * as prompts from "@clack/prompts";

import { isTemplate } from "../../predicates/isTemplate.js";
import { promptForPreset } from "../prompts/promptForPreset.js";
import { tryImportWithPredicate } from "../tryImportWithPredicate.js";
import { tryImportAndInstallIfNecessary } from "./tryImportAndInstallIfNecessary.js";

export async function tryImportTemplatePreset(
	from: string,
	requestedPreset?: string,
) {
	const template = await tryImportWithPredicate(
		tryImportAndInstallIfNecessary,
		from,
		isTemplate,
		"Template",
	);
	if (template instanceof Error) {
		return template;
	}

	const preset = await promptForPreset(requestedPreset, template);
	if (prompts.isCancel(preset)) {
		return preset;
	}

	return { preset, template };
}
