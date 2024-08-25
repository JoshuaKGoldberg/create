import { z } from "zod";

import { AnyOptionsSchema, InferredSchema } from "./options";
import { Creation, ProvidedContext } from "./shared";
import { PromiseOrSync } from "./utils";

export interface BlockDefinition<BlockOptionsSchema extends AnyOptionsSchema> {
	options: BlockOptionsSchema;
	produce: BlockProducer<BlockOptionsSchema>;
}

export type BlockProducer<BlockOptionsSchema extends AnyOptionsSchema> = (
	context: ProvidedContext<BlockOptionsSchema>,
) => PromiseOrSync<Creation>;

export interface Block<BlockOptionsSchema extends AnyOptionsSchema>
	extends BlockProducer<BlockOptionsSchema> {
	createAddon: <AddonOptionsSchema extends AnyOptionsSchema>(
		addonDefinition: AddonDefinition<AddonOptionsSchema, BlockOptionsSchema>,
	) => Addon<AddonOptionsSchema, BlockOptionsSchema>;
}

export type Addon<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
> = (
	context: ProvidedContext<AddonOptionsSchema>,
) => PromiseOrSync<InferredSchema<BlockOptionsSchema>>;

export interface AddonDefinition<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
> {
	options: AddonOptionsSchema;
	produce: AddonProducer<AddonOptionsSchema, BlockOptionsSchema>;
}

export type AddonProducer<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
> = (
	context: ProvidedContext<AddonOptionsSchema>,
) => PromiseOrSync<InferredSchema<BlockOptionsSchema>>;

export function createBlock<BlockOptionsSchema extends AnyOptionsSchema>(
	blockDefinition: BlockDefinition<BlockOptionsSchema>,
): Block<BlockOptionsSchema> {
	const blockSchema = z.object(blockDefinition.options);

	const block = async (context: ProvidedContext<BlockOptionsSchema>) => {
		return await blockDefinition.produce({
			...context,
			options: blockSchema.parse(context.options),
		});
	};

	block.createAddon = <AddonOptionsSchema extends AnyOptionsSchema>(
		addonDefinition: AddonDefinition<AddonOptionsSchema, BlockOptionsSchema>,
	) => {
		const addonSchema = z.object(addonDefinition.options);

		return async (context: ProvidedContext<AddonOptionsSchema>) => {
			return await addonDefinition.produce({
				...context,
				options: addonSchema.parse(context.options),
			});
		};
	};

	return block;
}
