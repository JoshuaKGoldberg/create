import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Base } from "./bases.js";
import { BlockData } from "./blocks.js";

export interface PresetDefinition<Options> {
	about?: AboutBase;
	blocks: BlockData<Options>[];
}

export interface Preset<OptionsShape extends AnyShape> {
	about?: AboutBase;
	base: Base<OptionsShape>;
	blocks: BlockData<InferredObject<OptionsShape>>[];
}
