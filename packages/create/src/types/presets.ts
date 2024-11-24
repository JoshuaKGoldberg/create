import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Base } from "./bases.js";
import { Block, BlockWithAddons, BlockWithoutAddons } from "./blocks.js";

export interface PresetDefinition<Options extends object> {
	about?: AboutBase;
	blocks: (BlockWithAddons<any, Options> | BlockWithoutAddons<Options>)[];
}

export interface Preset<OptionsShape extends AnyShape> {
	about?: AboutBase;
	base: Base<OptionsShape>;
	blocks: Block<object | undefined, InferredObject<OptionsShape>>[];
}
