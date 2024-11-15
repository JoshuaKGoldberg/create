import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Creation, IndirectCreation } from "./creations.js";

// TODO: Rename from (BlockFactory -> Block) to (Block -> BlockData)?

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export interface BlockDefinitionWithoutArgs<Options>
	extends BlockDefinitionBase {
	produce: BlockProducerWithoutArgs<Options>;
}

export interface BlockDefinitionWithArgs<ArgsShape extends AnyShape, Options>
	extends BlockDefinitionBase {
	args: ArgsShape;
	produce: BlockProducerWithArgs<InferredObject<ArgsShape>, Options>;
}

export type BlockDefinition<
	ArgsShape extends AnyShape | undefined,
	Options,
> = ArgsShape extends object
	? BlockDefinitionWithArgs<ArgsShape, Options>
	: BlockDefinitionWithoutArgs<Options>;

export interface BlockContextWithoutArgs<Options> {
	created: IndirectCreation<Options>;
	options: Options;
}

export interface BlockContextWithArgs<Args, Options>
	extends BlockContextWithoutArgs<Options> {
	args: Args;
	created: IndirectCreation<Options>;
	options: Options;
}

export interface BlockContextWithOptionalArgs<Args, Options>
	extends BlockContextWithoutArgs<Options> {
	args?: Args;
	created: IndirectCreation<Options>;
	options: Options;
}

export type BlockProducerWithoutArgs<Options> = (
	context: BlockContextWithoutArgs<Options>,
) => Partial<Creation<Options>>;

export type BlockProducerWithArgs<Args, Options> = (
	context: BlockContextWithArgs<Args, Options>,
) => Partial<Creation<Options>>;

export type BlockFactoryWithoutArgs<Options> = () => Block<undefined, Options>;

export type BlockFactoryWithRequiredArgs<Args, Options> = (
	args: Args,
) => BlockWithArgs<Args, Options>;

export type BlockFactoryWithOptionalArgs<Args, Options> = (
	args?: Args,
) => BlockWithOptionalArgs<Args, Options>;

export interface BlockWithoutArgs<Options> {
	about?: AboutBase;
	produce: (
		context: BlockContextWithoutArgs<Options>,
	) => Partial<Creation<Options>>;
}

export interface BlockWithOptionalArgs<Args, Options> {
	about?: AboutBase;
	args: Args;
	produce: (
		context: BlockContextWithoutArgs<Options>,
	) => Partial<Creation<Options>>;
}

export interface BlockWithArgs<Args, Options> {
	about?: AboutBase;
	args: Args;
	produce: (
		context: BlockContextWithoutArgs<Options>,
	) => Partial<Creation<Options>>;
}

export type Block<Args, Options> = Args extends object
	? BlockWithArgs<Args, Options>
	: BlockWithoutArgs<Options>;
