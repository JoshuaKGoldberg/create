import { AnyShape } from "../options.js";
import { Preset, PresetDefinition } from "../types/presets.js";

export function createPreset<OptionsShape extends AnyShape>(
	definition: PresetDefinition<OptionsShape>,
): Preset<OptionsShape> {
	return definition;
}
