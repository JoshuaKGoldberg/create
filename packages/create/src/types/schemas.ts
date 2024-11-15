import { AnyOptionalShape, AnyShape, InferredObject } from "../options.js";
import {
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "./blocks.js";
import { TakeContext } from "./context.js";
import { TakeInput } from "./inputs.js";
import { Preset, PresetDefinition } from "./presets.js";

export interface SchemaDefinition<OptionsShape extends AnyShape> {
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface Schema<OptionsShape extends AnyShape> {
	createBlock: CreateBlockFactory<InferredObject<OptionsShape>>;
	createPreset: CreatePresetFactory<OptionsShape>;
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface SchemaContext<Options> extends TakeContext {
	options: Options;
	take: TakeInput;
}

export type SchemaProducer<Options> = (
	context: SchemaContext<Partial<Options>>,
) => LazyOptionalOptions<Partial<Options>>;

export type LazyOptionalOptions<Options> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};

export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

export interface CreateBlockFactory<Options> {
	<ArgsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockFactoryWithOptionalArgs<InferredObject<ArgsShape>, Options>;

	<ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockFactoryWithRequiredArgs<InferredObject<ArgsShape>, Options>;

	(
		blockDefinition: BlockDefinitionWithoutArgs<Options>,
	): BlockFactoryWithoutArgs<Options>;
}

export type CreatePresetFactory<OptionsShape extends AnyShape> = (
	presetDefinition: PresetDefinition<InferredObject<OptionsShape>>,
) => Preset<OptionsShape>;

export type SchemaOptionsFor<TypeofSchema> = TypeofSchema extends {
	options: infer OptionsShape extends AnyShape;
}
	? InferredObject<OptionsShape>
	: never;
