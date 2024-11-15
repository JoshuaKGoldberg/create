import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { BlockWithArgs, BlockWithoutArgs } from "./blocks.js";
import { Schema } from "./schemas.js";

export type PresetDefinitionBlock<Options> =
	| BlockWithArgs<unknown, Options>
	| BlockWithoutArgs<Options>;

export interface PresetDefinition<Options> {
	about?: AboutBase;
	blocks: PresetDefinitionBlock<Options>[];
}

export interface Preset<OptionsShape extends AnyShape>
	extends PresetDefinition<InferredObject<OptionsShape>> {
	schema: Schema<OptionsShape>;
}
