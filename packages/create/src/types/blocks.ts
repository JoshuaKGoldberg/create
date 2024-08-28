import { AnyOptionsSchema, InferredSchema } from "../options";
import { PromiseOrSync } from "../utils";
import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "./context";
import { CreationFirstRound } from "./creations";

// Blocks (Definitions)

export type BlockProducer<
	BlockOptionsSchema extends AnyOptionsSchema | undefined = undefined,
> = BlockOptionsSchema extends object
	? BlockProducerWithOptions<BlockOptionsSchema>
	: BlockProducerWithoutOptions;

export type BlockProducerWithoutOptions = (
	context: CreationContextWithoutOptions,
) => PromiseOrSync<CreationFirstRound>;

export type BlockProducerWithOptions<
	BlockOptionsSchema extends AnyOptionsSchema,
> = (
	context: CreationContextWithOptions<BlockOptionsSchema>,
) => PromiseOrSync<CreationFirstRound>;

// Blocks (Processed)

export type Block<BlockOptions extends object | undefined = undefined> =
	BlockOptions extends object
		? BlockWithOptions<BlockOptions>
		: BlockWithoutOptions;

export type BlockWithoutOptions = (
	context: CreationContextWithoutOptions,
) => PromiseOrSync<CreationFirstRound>;

export interface BlockWithOptions<BlockOptions extends object> {
	(
		context: CreationContextWithOptions<BlockOptions>,
	): PromiseOrSync<CreationFirstRound>;
	createAddon: <
		AddonOptionsSchema extends AnyOptionsSchema | undefined = undefined,
	>(
		addonDefinition: AddonDefinition<BlockOptions, AddonOptionsSchema>,
	) => Addon<BlockOptions, InferredSchema<AddonOptionsSchema>>;
}

// Block Addons (Definitions)

export type AddonDefinition<
	BlockOptions extends object,
	AddonOptionsSchema extends AnyOptionsSchema | undefined,
> = AddonOptionsSchema extends AnyOptionsSchema
	? AddonDefinitionWithOptions<BlockOptions, AddonOptionsSchema>
	: AddonDefinitionWithoutOptions<BlockOptions>;

export interface AddonDefinitionWithoutOptions<BlockOptions extends object> {
	produce: AddonProducer<BlockOptions>;
}

export interface AddonDefinitionWithOptions<
	BlockOptions extends object,
	AddonOptionsSchema extends AnyOptionsSchema,
> {
	options: AddonOptionsSchema;
	produce: AddonProducer<BlockOptions, InferredSchema<AddonOptionsSchema>>;
}

export type AddonProducer<
	BlockOptions extends object,
	AddonOptions extends object | undefined = undefined,
> = AddonOptions extends object
	? AddonProducerWithOptions<BlockOptions, AddonOptions>
	: AddonProducerWithoutOptions<BlockOptions>;

export type AddonProducerWithoutOptions<BlockOptions extends object> = (
	context: CreationContextWithoutOptions,
) => PromiseOrSync<BlockOptions>;

export type AddonProducerWithOptions<
	BlockOptions extends object,
	AddonOptions extends object,
> = (
	context: CreationContextWithOptions<AddonOptions>,
) => PromiseOrSync<BlockOptions>;

// Block Addons (Processed)

export type Addon<
	BlockOptions extends object,
	AddonOptions extends object | undefined = undefined,
> = AddonOptions extends object
	? AddonWithOptions<BlockOptions, AddonOptions>
	: AddonWithoutOptions<BlockOptions>;

export type AddonWithoutOptions<BlockOptions extends object> = (
	context: CreationContextWithoutOptions,
) => PromiseOrSync<BlockOptions>;

export type AddonWithOptions<
	BlockOptions extends object,
	AddonOptions extends object,
> = (
	context: CreationContextWithOptions<AddonOptions>,
) => PromiseOrSync<BlockOptions>;
