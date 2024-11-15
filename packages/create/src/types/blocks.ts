import { AnyShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { Creation, IndirectCreation } from "./creations.js";

// TODO: Rename from (BlockFactory -> Block) to (Block -> BlockData)

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export interface BlockDefinitionWithoutArgs<Metadata, Options>
	extends BlockDefinitionBase {
	produce: BlockProducerWithoutArgs<Metadata, Options>;
}

export interface BlockDefinitionWithArgs<
	ArgsShape extends AnyShape,
	Metadata,
	Options,
> extends BlockDefinitionBase {
	args: ArgsShape;
	produce: BlockProducerWithArgs<InferredObject<ArgsShape>, Metadata, Options>;
}

export type BlockDefinition<
	ArgsShape extends AnyShape | undefined,
	Metadata,
	Options,
> = ArgsShape extends object
	? BlockDefinitionWithArgs<ArgsShape, Metadata, Options>
	: BlockDefinitionWithoutArgs<Metadata, Options>;

export interface BlockContextWithoutArgs<Metadata, Options> {
	created: IndirectCreation<Metadata, Options>;
	options: Options;
}

export interface BlockContextWithArgs<Args, Metadata, Options>
	extends BlockContextWithoutArgs<Metadata, Options> {
	args: Args;
	created: IndirectCreation<Metadata, Options>;
	options: Options;
}

export interface BlockContextWithOptionalArgs<Args, Metadata, Options>
	extends BlockContextWithoutArgs<Metadata, Options> {
	args?: Args;
	created: IndirectCreation<Metadata, Options>;
	options: Options;
}

export type BlockProducerWithoutArgs<Metadata, Options> = (
	context: BlockContextWithoutArgs<Metadata, Options>,
) => Partial<Creation<Metadata, Options>>;

export type BlockProducerWithArgs<Args, Metadata, Options> = (
	context: BlockContextWithArgs<Args, Metadata, Options>,
) => Partial<Creation<Metadata, Options>>;

export type BlockFactoryWithoutArgs<Metadata, Options> = () => Block<
	undefined,
	Metadata,
	Options
>;

export type BlockFactoryWithRequiredArgs<Args, Metadata, Options> = (
	args: Args,
) => BlockWithArgs<Args, Metadata, Options>;

export type BlockFactoryWithOptionalArgs<Args, Metadata, Options> = (
	args?: Args,
) => BlockWithOptionalArgs<Args, Metadata, Options>;

export interface BlockWithoutArgs<Metadata, Options> {
	about?: AboutBase;
	produce: (
		context: BlockContextWithoutArgs<Metadata, Options>,
	) => Partial<Creation<Metadata, Options>>;
}

export interface BlockWithOptionalArgs<Args, Metadata, Options> {
	about?: AboutBase;
	args: Args;
	produce: (
		context: BlockContextWithoutArgs<Metadata, Options>,
	) => Partial<Creation<Metadata, Options>>;
}

export interface BlockWithArgs<Args, Metadata, Options> {
	about?: AboutBase;
	args: Args;
	produce: (
		context: BlockContextWithoutArgs<Metadata, Options>,
	) => Partial<Creation<Metadata, Options>>;
}

export type Block<Args, Metadata, Options> = Args extends object
	? BlockWithArgs<Args, Metadata, Options>
	: BlockWithoutArgs<Metadata, Options>;
