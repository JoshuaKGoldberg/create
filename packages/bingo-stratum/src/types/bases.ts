import {
	AnyOptionalShape,
	AnyShape,
	InferredObject,
	LazyOptionalOptions,
	TakeContext,
	TakeInput,
} from "bingo";

import {
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "./blocks.js";
import { Preset, PresetDefinition } from "./presets.js";

export interface Base<OptionsShape extends AnyShape = AnyShape> {
	createBlock: CreateBlock<InferredObject<OptionsShape>>;
	createPreset: CreatePreset<OptionsShape>;
	options: OptionsShape;
	produce?: BaseProducer<InferredObject<OptionsShape>>;
}

export interface BaseContext<Options> extends TakeContext {
	options: Options;
	take: TakeInput;
}

export interface BaseDefinition<OptionsShape extends AnyShape> {
	options: OptionsShape;
	produce?: BaseProducer<InferredObject<OptionsShape>>;
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
