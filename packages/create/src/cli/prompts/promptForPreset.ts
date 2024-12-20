import * as prompts from "@clack/prompts";

import { Template, TemplatePresetListing } from "../../types/templates.js";

export async function promptForPreset(
	requested: string | undefined,
	template: Template,
) {
	if (requested) {
		if (requested in template.presets) {
			return template.presets[requested].preset;
		}

		prompts.log.error(
			`${requested} is not one of: ${Array.from(Object.keys(template.presets)).join(", ")}`,
		);
	}

	const preset = await prompts.select({
		message: "Which Preset would you like to start with?",
		options: Object.entries(template.presets).map(([preset, listing]) => ({
			...generatePresetLabel(listing),
			value: preset,
		})),
	});

	if (prompts.isCancel(preset)) {
		return preset;
	}

	return template.presets[preset].preset;
}
function generatePresetLabel(listing: TemplatePresetListing) {
	if (!listing.preset.about?.name) {
		return { label: listing.label };
	}

	return {
		hint: listing.preset.about.description,
		label: listing.preset.about.name,
	};
}
