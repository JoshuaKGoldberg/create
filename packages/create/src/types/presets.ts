import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Block } from "./blocks.js";
import { Schema } from "./schemas.js";

export interface PresetDefinition<OptionsShape extends AnyShape = AnyShape> {
	about?: AboutBase;
	blocks: Block<InferredObject<OptionsShape>>[];
}

export interface Preset<OptionsShape extends AnyShape = AnyShape>
	extends PresetDefinition<OptionsShape> {
	schema: Schema<OptionsShape>;
}
