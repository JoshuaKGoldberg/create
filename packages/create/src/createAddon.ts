import { z } from "zod";

import { AddonDefinition } from "./createBlock";
import { AnyOptionsSchema } from "./options";
import { ProvidedContext } from "./shared";

export function createAddon<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
>(addonDefinition: AddonDefinition<AddonOptionsSchema, BlockOptionsSchema>) {
	const addonSchema = z.object(addonDefinition.options);

	return async (context: ProvidedContext<AddonOptionsSchema>) => {
		return await addonDefinition.produce({
			...context,
			options: addonSchema.parse(context.options),
		});
	};
}
