import {
	AnyShape,
	awaitLazyProperties,
	Base,
	InferredObject,
	TakeInput,
} from "create";

import { createFailingFunction, createFailingObject } from "./utils.js";

export interface BaseContextSettings<OptionsShape extends AnyShape> {
	options?: InferredObject<OptionsShape>;
	take?: TakeInput;
}

export async function testBase<OptionsShape extends AnyShape>(
	base: Base<OptionsShape>,
	settings: Partial<BaseContextSettings<OptionsShape>> = {},
) {
	if (!base.produce) {
		return settings.options;
	}

	return await awaitLazyProperties(
		base.produce({
			options: createFailingObject(
				"options",
				"the Base",
			) as InferredObject<OptionsShape>,
			take: createFailingFunction("take", "the Base"),
			...settings,
		}),
	);
}
