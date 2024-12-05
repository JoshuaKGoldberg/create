import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Base } from "./bases.js";
import { Block, BlockWithAddons, BlockWithoutAddons } from "./blocks.js";

export interface PresetDefinition<Options extends object> {
	about?: AboutBase;
	// TODO: Figure out how to replace this with ... never? object?
	// Note it needs to pass tsc both in this repo and in create-typescript-app.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	blocks: (BlockWithAddons<any, Options> | BlockWithoutAddons<Options>)[];
}

export interface Preset<OptionsShape extends AnyShape> {
	about?: AboutBase;
	base: Base<OptionsShape>;
	blocks: Block<object | undefined, InferredObject<OptionsShape>>[];
}
