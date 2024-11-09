import {
	AnyOptionalShape,
	AnyShape,
	InferredObject,
	InputShape,
} from "../options.js";
import {
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "./blocks.js";
import { ContextBase } from "./context.js";
import { Preset, PresetDefinition } from "./presets.js";

export interface SchemaDefinition<OptionsShape extends AnyShape> {
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface Schema<OptionsShape extends AnyShape> {
	createBlock: CreateBlockFactory<OptionsShape>;
	createPreset: CreatePresetFactory<OptionsShape>;
	options: OptionsShape;
	produce?: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface SchemaWithProduce<OptionsShape extends AnyShape>
	extends Schema<OptionsShape> {
	produce: SchemaProducer<InferredObject<OptionsShape>>;
}

export interface SchemaContext<Options extends object> extends ContextBase {
	options: Options;
}

export type SchemaProducer<Options extends object> = (
	context: SchemaContext<Partial<Options>>,
) => LazyOptionalOptions<Partial<Options>>;

export type LazyOptionalOptions<Options extends object> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};

export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

export interface CreateBlockFactory<OptionsShape extends AnyShape> {
	<ArgsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithArgs<
			InferredObject<OptionsShape>,
			ArgsShape
		>,
	): BlockFactoryWithOptionalArgs<
		InferredObject<OptionsShape>,
		InputShape<ArgsShape>
	>;

	<ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<
			InferredObject<OptionsShape>,
			ArgsShape
		>,
	): BlockFactoryWithRequiredArgs<
		InferredObject<OptionsShape>,
		InputShape<ArgsShape>
	>;

	(
		blockDefinition: BlockDefinitionWithoutArgs<InferredObject<OptionsShape>>,
	): BlockFactoryWithoutArgs<InferredObject<OptionsShape>>;
}

export type CreatePresetFactory<OptionsShape extends AnyShape> = (
	presetDefinition: PresetDefinition<OptionsShape>,
) => Preset<OptionsShape>;

export type SchemaContextFor<TypeofSchema> =
	TypeofSchema extends SchemaContext<infer OptionsShape>
		? SchemaContext<OptionsShape>
		: never;

export type SchemaOptionsFor<TypeofSchema> =
	TypeofSchema extends Schema<infer OptionsShape>
		? InferredObject<OptionsShape>
		: never;
