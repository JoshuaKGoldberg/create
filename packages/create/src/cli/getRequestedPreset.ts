import { Template } from "../types/templates.js";

export function getRequestedPreset(requested: string, template: Template) {
	const presetsByName = new Map(
		Array.from(
			template.presets.map((preset) => [
				preset.about.name.toLowerCase(),
				preset,
			]),
		),
	);

	return (
		presetsByName.get(requested.toLowerCase()) ??
		new Error(
			`${requested} is not one of: ${Array.from(presetsByName.keys()).join(", ")}`,
		)
	);
}
