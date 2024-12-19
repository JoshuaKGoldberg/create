import { AnyOptionalShape, AnyShape, InferredObject } from "../options.js";
import {
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "./blocks.js";
import { TakeContext } from "./context.js";
import { TakeInput } from "./inputs.js";
import { Preset, PresetDefinition } from "./presets.js";

export interface Base<OptionsShape extends AnyShape = AnyShape> {
	createBlock: CreateBlock<InferredObject<OptionsShape>>;
	createPreset: CreatePreset<OptionsShape>;
	options: OptionsShape;
	produce?: BaseProducer<InferredObject<OptionsShape>>;
	template?: RepositoryTemplate;
}

export interface BaseContext<Options> extends TakeContext {
	options: Options;
	take: TakeInput;
}

export interface BaseDefinition<OptionsShape extends AnyShape> {
	options: OptionsShape;
	produce?: BaseProducer<InferredObject<OptionsShape>>;
	template?: RepositoryTemplate;
}

export type BaseOptionsFor<TypeOfBase> = TypeOfBase extends {
	options: infer OptionsShape extends AnyShape;
}
	? InferredObject<OptionsShape>
	: never;

export type BaseProducer<Options> = (
	context: BaseContext<Partial<Options>>,
) => LazyOptionalOptions<Partial<Options>>;

export interface CreateBlock<Options extends object> {
	<AddonsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithAddons<AddonsShape, Options>,
	): BlockWithAddons<InferredObject<AddonsShape>, Options>;

	(
		blockDefinition: BlockDefinitionWithoutAddons<Options>,
	): BlockWithoutAddons<Options>;
}

export type CreatePreset<OptionsShape extends AnyShape> = (
	presetDefinition: PresetDefinition<InferredObject<OptionsShape>>,
) => Preset<OptionsShape>;

export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

export type LazyOptionalOptions<Options> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};

export interface RepositoryTemplate {
	owner: string;
	repository: string;
}
