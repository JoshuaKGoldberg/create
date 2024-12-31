import { Block } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";
import { Preset } from "../types/presets.js";

export interface BlockModifications<Options extends object = object> {
	add?: Block<Options>[];
	remove?: Block<Options>[];
}

export interface CreateConfig {
	preset: Preset;
	settings?: CreateConfigSettings;
}

export interface CreateConfigSettings<Options extends object = object> {
	addons?: CreatedBlockAddons<object, Options>[];
	blocks?: BlockModifications<Options>;
}
