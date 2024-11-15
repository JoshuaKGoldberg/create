import {
	AnyShape,
	awaitLazyProperties,
	InferredObject,
	Schema,
	TakeInput,
} from "create";

import { createFailingFunction, createFailingObject } from "./utils.js";

export interface SchemaContextSettings<OptionsShape extends AnyShape> {
	options?: InferredObject<OptionsShape>;
	take?: TakeInput;
}

export async function testSchema<OptionsShape extends AnyShape>(
	schema: Schema<AnyShape | undefined, OptionsShape>,
	settings: Partial<SchemaContextSettings<OptionsShape>> = {},
) {
	if (!schema.produce) {
		return settings.options;
	}

	return await awaitLazyProperties(
		schema.produce({
			options: createFailingObject(
				"options",
				"the schema",
			) as InferredObject<OptionsShape>,
			take: createFailingFunction("take", "the schema"),
			...settings,
		}),
	);
}
