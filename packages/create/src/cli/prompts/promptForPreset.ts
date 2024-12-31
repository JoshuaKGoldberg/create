import * as prompts from "@clack/prompts";

import { Template } from "../../types/templates.js";
import { getRequestedPreset } from "../getRequestedPreset.js";

export async function promptForPreset(
	requested: string | undefined,
	template: Template,
) {
	if (requested) {
		const found = getRequestedPreset(requested, template);

		if (found instanceof Error) {
			prompts.log.error(found.message);
		} else {
			return found;
		}
	}

	return await prompts.select({
		initialValue: template.suggested,
		message: "Which --preset would you like to create with?",
		options: template.presets.map((preset) => ({
			hint: preset.about.description,
			label: preset.about.name,
			value: preset,
		})),
	});
}
