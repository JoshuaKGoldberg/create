import { z } from "zod";

import { AnyOptionsSchema, InferredSchema } from "../options.js";
import {
	AddonDefinition,
	Block,
	BlockProducerWithOptions,
	BlockProducerWithoutOptions,
} from "../types/blocks.js";
import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "../types/context.js";
import { DocumentationBase } from "../types/documentation.js";
import { isDefinitionWithOptions } from "./utils.js";

export interface BlockDefinitionBase {
	documentation?: DocumentationBase;
}

export type BlockDefinition<
	BlockOptionsSchema extends AnyOptionsSchema | undefined,
> = BlockOptionsSchema extends object
	? BlockDefinitionWithOptions<BlockOptionsSchema>
	: BlockDefinitionWithoutOptions;

export interface BlockDefinitionWithoutOptions extends BlockDefinitionBase {
	produce: BlockProducerWithoutOptions;
}

export interface BlockDefinitionWithOptions<
	BlockOptionsSchema extends AnyOptionsSchema,
> extends BlockDefinitionBase {
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
