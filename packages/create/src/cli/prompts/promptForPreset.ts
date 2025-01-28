import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { Template } from "../../types/templates.js";
import { getPresetByName } from "../../utils/getPresetByName.js";

export async function promptForPreset(
	requested: string | undefined,
	template: Template,
) {
	if (requested) {
		const found = getPresetByName(template.presets, requested);

		if (!(found instanceof Error)) {
			return found;
		}

		prompts.log.error(found.message);
	}

	return await prompts.select({
		initialValue: template.suggested,
		message: "Which --preset would you like to create with?",
		options: template.presets.map((preset) => ({
			label: [
				chalk.bold(preset.about.name),
				preset.about.description && chalk.gray(preset.about.description),
			]
				.filter(Boolean)
				.join(" "),
			value: preset,
		})),
	});
}
