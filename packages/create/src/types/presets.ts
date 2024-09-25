import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Block } from "./blocks.js";
import { Schema } from "./schemas.js";

export interface PresetDefinition<OptionsShape extends AnyShape> {
	about?: AboutBase;
	blocks: Block<InferredObject<OptionsShape>>[];
	repository?: string;
}

export interface Preset<OptionsShape extends AnyShape>
	extends PresetDefinition<OptionsShape> {
	schema: Schema<OptionsShape>;
}
