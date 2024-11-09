import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Block } from "./blocks.js";
import { Schema } from "./schemas.js";

type PresetBlock<OptionsShape extends AnyShape> = Block<
	InferredObject<OptionsShape>
>;

export interface PresetDefinition<OptionsShape extends AnyShape = AnyShape> {
	about?: AboutBase;
	blocks: PresetBlocksDefinition<OptionsShape>;
}

export type PresetBlocksDefinition<OptionsShape extends AnyShape> =
	| ((options: InferredObject<OptionsShape>) => PresetBlock<OptionsShape>[])
	| PresetBlock<OptionsShape>[];

export interface Preset<OptionsShape extends AnyShape = AnyShape>
	extends PresetDefinition<OptionsShape> {
	schema: Schema<OptionsShape>;
}
