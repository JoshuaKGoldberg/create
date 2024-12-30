import * as prompts from "@clack/prompts";

import { Template } from "../../types/templates.js";

export async function promptForPreset(
	requested: string | undefined,
	template: Template,
) {
	const presetsByName = new Map(
		Array.from(
			template.presets.map((preset) => [
				preset.about.name.toLowerCase(),
				preset,
			]),
		),
	);

	if (requested) {
		const found = presetsByName.get(requested.toLowerCase());
		if (found) {
			return found;
		}

		prompts.log.error(
			`${requested} is not one of: ${Array.from(presetsByName.keys()).join(", ")}`,
		);
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
