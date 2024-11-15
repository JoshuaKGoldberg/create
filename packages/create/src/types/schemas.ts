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

export interface SchemaDefinitionWithoutMetadata<
	OptionsShape extends AnyShape,
> {
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface SchemaDefinitionWithMetadata<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> extends SchemaDefinitionWithoutMetadata<OptionsShape> {
	metadata: MetadataShape;
}

export type SchemaDefinition<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> = MetadataShape extends object
	? SchemaDefinitionWithMetadata<MetadataShape, OptionsShape>
	: SchemaDefinitionWithoutMetadata<OptionsShape>;

export interface SchemaWithoutMetadata<OptionsShape extends AnyShape> {
	createBlock: CreateBlockFactory<never, InferredObject<OptionsShape>>;
	createPreset: CreatePresetFactory<never, OptionsShape>;
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface SchemaWithMetadata<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> {
	createBlock: CreateBlockFactory<
		InferredObject<MetadataShape>,
		InferredObject<OptionsShape>
	>;
	createPreset: CreatePresetFactory<MetadataShape, OptionsShape>;
	metadata: MetadataShape;
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export type Schema<
	MetadataShape extends AnyShape | undefined,
	OptionsShape extends AnyShape,
> = MetadataShape extends object
	? SchemaWithMetadata<MetadataShape, OptionsShape>
	: SchemaWithoutMetadata<OptionsShape>;

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

export interface CreateBlockFactory<Metadata, Options> {
	<ArgsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Metadata, Options>,
	): BlockFactoryWithOptionalArgs<InferredObject<ArgsShape>, Metadata, Options>;

	<ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Metadata, Options>,
	): BlockFactoryWithRequiredArgs<InferredObject<ArgsShape>, Metadata, Options>;

	(
		blockDefinition: BlockDefinitionWithoutArgs<Metadata, Options>,
	): BlockFactoryWithoutArgs<Metadata, Options>;
}

export type CreatePresetFactory<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> = (
	presetDefinition: PresetDefinition<
		InferredObject<MetadataShape>,
		InferredObject<OptionsShape>
	>,
) => Preset<MetadataShape, OptionsShape>;

export type SchemaOptionsFor<TypeofSchema> = TypeofSchema extends {
	options: infer OptionsShape extends AnyShape;
}
	? InferredObject<OptionsShape>
	: never;
