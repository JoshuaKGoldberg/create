import {
	AnyShape,
	HasOnlyRequiredProperties,
	InferredObject,
} from "../options.js";
import { AboutBase } from "./about.js";
import { Creation } from "./creations.js";

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export interface BlockDefinitionWithoutArgs<Options>
	extends BlockDefinitionBase {
	produce: BlockDefinitionProducerWithoutArgs<Options>;
}

export interface BlockDefinitionWithArgs<ArgsShape extends AnyShape, Options>
	extends BlockDefinitionBase {
	args: ArgsShape;
	produce: BlockDefinitionProducerWithArgs<InferredObject<ArgsShape>, Options>;
}

export type BlockDefinition<
	ArgsShape extends AnyShape | undefined,
	Options,
> = ArgsShape extends object
	? BlockDefinitionWithArgs<ArgsShape, Options>
	: BlockDefinitionWithoutArgs<Options>;

export type BlockDefinitionProducerWithoutArgs<Options> = (
	context: BlockContextWithoutArgs<Options>,
) => Partial<Creation<Options>>;

export type BlockDefinitionProducerWithArgs<Args, Options> = (
	context: BlockContextWithArgs<Args, Options>,
) => Partial<Creation<Options>>;

export interface BlockContextWithoutArgs<Options> {
	options: Options;
}

export interface BlockContextWithArgs<Args, Options>
	extends BlockContextWithoutArgs<Options> {
	args: Args;
	options: Options;
}

export interface BlockContextWithOptionalArgs<Args, Options>
	extends BlockContextWithoutArgs<Options> {
	args?: Args;
	options: Options;
}

export type BlockWithoutArgs<Options> = () => BlockDataWithoutArgs<Options>;

export type BlockWithRequiredArgs<Args, Options> = (
	args: Args,
) => BlockDataWithArgs<Args, Options>;

export type BlockWithOptionalArgs<Args, Options> = (
	args?: Args,
) => BlockDataWithArgs<Args, Options>;

export type BlockWithArgs<Args, Options> =
	HasOnlyRequiredProperties<Args> extends true
		? BlockWithRequiredArgs<Args, Options>
		: BlockWithOptionalArgs<Args, Options>;

export type Block<Args, Options> = Args extends object
	? HasOnlyRequiredProperties<Args> extends true
		? BlockWithRequiredArgs<Args, Options>
		: BlockWithOptionalArgs<Args, Options>
	: BlockWithoutArgs<Options>;

export interface BlockDataWithArgs<Args, Options> {
	args: Args;
	block: BlockWithArgs<Args, Options>;
	produce: BlockDataProducerWithOptionalArgs<Args, Options>;
}

export interface BlockDataWithoutArgs<Options> {
	block: BlockWithoutArgs<Options>;
	produce: BlockDataProducerWithoutArgs<Options>;
}

export type BlockData<Options> =
	| BlockDataWithArgs<object, Options>
	| BlockDataWithoutArgs<Options>;

export type BlockDataProducerWithOptionalArgs<Args, Options> = (
	context: BlockContextWithOptionalArgs<Args, Options>,
) => Partial<Creation<Options>>;

export type BlockDataProducerWithoutArgs<Options> = (
	context: BlockContextWithoutArgs<Options>,
) => Partial<Creation<Options>>;
