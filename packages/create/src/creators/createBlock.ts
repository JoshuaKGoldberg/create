import { z } from "zod";

import { AnyOptionsSchema } from "../options";
import {
	AddonDefinition,
	Block,
	BlockProducer,
	ContextWithOptions,
} from "../shared";

export interface BlockDefinition<BlockOptionsSchema extends AnyOptionsSchema> {
	options: BlockOptionsSchema;
	produce: BlockProducer<BlockOptionsSchema>;
}

export function createBlock<BlockOptionsSchema extends AnyOptionsSchema>(
	blockDefinition: BlockDefinition<BlockOptionsSchema>,
): Block<BlockOptionsSchema> {
	const blockSchema = z.object(blockDefinition.options);

	const block = async (context: ContextWithOptions<BlockOptionsSchema>) => {
		return await blockDefinition.produce({
			...context,
			options: blockSchema.parse(context.options),
		});
	};

	block.createAddon = <AddonOptionsSchema extends AnyOptionsSchema>(
		addonDefinition: AddonDefinition<AddonOptionsSchema, BlockOptionsSchema>,
	) => {
		const addonSchema = z.object(addonDefinition.options);

		return async (context: ContextWithOptions<AddonOptionsSchema>) => {
			return await addonDefinition.produce({
				...context,
				options: addonSchema.parse(context.options),
			});
		};
	};

	return block;
}
