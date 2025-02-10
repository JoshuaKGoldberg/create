import { AnyShape, InferredObject, Preset, Template } from "bingo";

import { Block } from "./blocks.js";
import { CreatedBlockAddons } from "./creations.js";

export interface BlockModifications<Options extends object = object> {
	add?: Block<object | undefined, Options>[];
	exclude?: Block<object | undefined, Options>[];
}

export interface CreateConfigSettings<Options extends object = object>
	extends CreatedConfigSettings<Options> {
	preset: string;
}

export interface CreatedConfig<OptionsShape extends AnyShape = AnyShape> {
	preset: Preset<OptionsShape>;
	settings?: CreatedConfigSettings<InferredObject<OptionsShape>>;
	template: Template<OptionsShape>;
}

export interface CreatedConfigSettings<Options extends object = object> {
	addons?: CreatedBlockAddons<object, Options>[];
	blocks?: BlockModifications<Options>;
	options?: Options;
}
