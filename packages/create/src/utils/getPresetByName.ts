import { AnyShape } from "../options.js";
import { Preset } from "../types/presets.js";

export function getPresetByName<OptionsShape extends AnyShape>(
	presets: Preset<OptionsShape>[],
	requested: string,
) {
	const presetsByName = new Map(
		Array.from(
			presets.map((preset) => [preset.about.name.toLowerCase(), preset]),
		),
	);

	return (
		presetsByName.get(requested.toLowerCase()) ??
		new Error(
			`${requested} is not one of: ${Array.from(presetsByName.keys()).join(", ")}`,
		)
	);
}
