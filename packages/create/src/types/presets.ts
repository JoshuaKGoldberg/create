import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { BlockWithArgs, BlockWithoutArgs } from "./blocks.js";
import { Schema } from "./schemas.js";

export type PresetDefinitionBlock<Metadata, Options> =
	| BlockWithArgs<unknown, Metadata, Options>
	| BlockWithoutArgs<Metadata, Options>;

export interface PresetDefinition<Metadata, Options> {
	about?: AboutBase;
	blocks: PresetDefinitionBlock<Metadata, Options>[];
}

export interface Preset<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> extends PresetDefinition<
		InferredObject<MetadataShape>,
		InferredObject<OptionsShape>
	> {
	schema: Schema<MetadataShape, OptionsShape>;
}
