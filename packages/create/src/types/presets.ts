import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Base } from "./bases.js";
import { BlockWithArgs, BlockWithoutArgs } from "./blocks.js";

export type PresetDefinitionBlock<Options> =
	| BlockWithArgs<unknown, Options>
	| BlockWithoutArgs<Options>;

export interface PresetDefinition<Options> {
	about?: AboutBase;
	blocks: PresetDefinitionBlock<Options>[];
}

export interface Preset<OptionsShape extends AnyShape>
	extends PresetDefinition<InferredObject<OptionsShape>> {
	base: Base<OptionsShape>;
}
