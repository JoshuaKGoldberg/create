import { AnyShape, InferredObject } from "../options.js";
import { Template } from "../types/templates.js";
import { getPresetByName } from "../utils/getPresetByName.js";
import { CreateConfigSettings, CreatedConfig } from "./types.js";

export function createConfig<OptionsShape extends AnyShape = AnyShape>(
	template: Template<OptionsShape>,
	{
		preset: requestedPreset,
		...settings
	}: CreateConfigSettings<InferredObject<OptionsShape>>,
): CreatedConfig<OptionsShape> {
	const preset = getPresetByName(template.presets, requestedPreset);
	if (preset instanceof Error) {
		throw preset;
	}

	return { preset, settings, template };
}
