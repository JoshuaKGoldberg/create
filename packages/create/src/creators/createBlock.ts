import { z } from "zod";

import { AnyOptionsSchema, InferredSchema } from "../options";
import {
	AddonDefinition,
	Block,
	BlockProducerWithOptions,
	BlockProducerWithoutOptions,
} from "../types/blocks";
import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "../types/context";
import { isDefinitionWithOptions } from "./utils";

export type BlockDefinition<
	BlockOptionsSchema extends AnyOptionsSchema | undefined,
> = BlockOptionsSchema extends object
	? BlockDefinitionWithOptions<BlockOptionsSchema>
	: BlockDefinitionWithoutOptions;

export interface BlockDefinitionWithoutOptions {
	produce: BlockProducerWithoutOptions;
}

export interface BlockDefinitionWithOptions<
	BlockOptionsSchema extends AnyOptionsSchema,
> {
	options: BlockOptionsSchema;
	produce: BlockProducerWithOptions<InferredSchema<BlockOptionsSchema>>;
}

export function createBlock<
	BlockOptionsSchema extends AnyOptionsSchema | undefined = undefined,
>(
	blockDefinition: BlockDefinition<BlockOptionsSchema>,
): Block<InferredSchema<BlockOptionsSchema>> {
	if (!isDefinitionWithOptions(blockDefinition)) {
		return ((context: CreationContextWithoutOptions) => {
			return blockDefinition.produce(context);
		}) as Block<InferredSchema<BlockOptionsSchema>>;
	}

	const blockSchema = z.object(blockDefinition.options);

	const block = async (
		context: CreationContextWithOptions<BlockOptionsSchema>,
	) => {
		return await blockDefinition.produce({
			...context,
			options: blockSchema.parse(context.options),
		});
	};

	block.createAddon = <AddonOptionsSchema extends AnyOptionsSchema>(
		addonDefinition: AddonDefinition<AddonOptionsSchema, BlockOptionsSchema>,
	) => {
		if (!isDefinitionWithOptions(addonDefinition)) {
			return (context: CreationContextWithoutOptions) => {
				return addonDefinition.produce(context);
			};
		}

		const addonSchema = z.object(addonDefinition.options);

		return async (context: CreationContextWithOptions<AddonOptionsSchema>) => {
			return await addonDefinition.produce({
				...context,
				options: addonSchema.parse(context.options),
			});
		};
	};

	return block as Block<InferredSchema<BlockOptionsSchema>>;
}
