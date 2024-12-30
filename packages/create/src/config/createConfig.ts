import { Block } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";
import { Preset } from "../types/presets.js";

export interface CreateConfig {
	preset: Preset;
	settings?: CreateConfigSettings;
}

export interface CreateConfigBlockSettings {
	add?: Block[];
	remove?: Block[];
}

export interface CreateConfigSettings {
	addons?: CreatedBlockAddons[];
	blocks?: CreateConfigBlockSettings;
}

export function createConfig(preset: Preset, settings?: CreateConfigSettings) {
	return { preset, settings };
}
