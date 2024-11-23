import { AnyOptionalShape, AnyShape, InferredObject } from "../options.js";
import {
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockWithOptionalArgs,
	BlockWithoutArgs,
	BlockWithRequiredArgs,
} from "./blocks.js";
import { TakeContext } from "./context.js";
import { TakeInput } from "./inputs.js";
import { Preset, PresetDefinition } from "./presets.js";

export interface BaseDefinition<OptionsShape extends AnyShape> {
	options: OptionsShape;
	produce?: BaseProducer<InferredObject<OptionsShape>>;
}

export interface Base<OptionsShape extends AnyShape> {
	createBlock: CreateBlock<InferredObject<OptionsShape>>;
	createPreset: CreatePreset<OptionsShape>;
	options: OptionsShape;
	produce?: BaseProducer<InferredObject<OptionsShape>>;
}

export interface BaseContext<Options> extends TakeContext {
	options: Options;
	take: TakeInput;
}

export type BaseProducer<Options> = (
	context: BaseContext<Partial<Options>>,
) => LazyOptionalOptions<Partial<Options>>;

export type LazyOptionalOptions<Options> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};

export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

export interface CreateBlock<Options> {
	<ArgsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockWithOptionalArgs<InferredObject<ArgsShape>, Options>;

	<ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockWithRequiredArgs<InferredObject<ArgsShape>, Options>;

	(
		blockDefinition: BlockDefinitionWithoutArgs<Options>,
	): BlockWithoutArgs<Options>;
}

export type CreatePreset<OptionsShape extends AnyShape> = (
	presetDefinition: PresetDefinition<InferredObject<OptionsShape>>,
) => Preset<OptionsShape>;

export type BaseOptionsFor<TypeOfBase> = TypeOfBase extends {
	options: infer OptionsShape extends AnyShape;
}
	? InferredObject<OptionsShape>
	: never;