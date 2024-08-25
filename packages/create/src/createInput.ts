import { z } from "zod";

import { AnyOptionsSchema, InferredSchema } from "./options";
import { ProvidedContext } from "./shared";

export interface InputDefinition<
	OptionsSchema extends AnyOptionsSchema,
	Result,
> {
	options: OptionsSchema;
	produce: Input<OptionsSchema, Result>;
}

export type Input<OptionsSchema extends AnyOptionsSchema, Result> = (
	context: ProvidedContext<OptionsSchema>,
) => Result;

export function createInput<OptionsSchema extends AnyOptionsSchema, Result>(
	definition: InputDefinition<OptionsSchema, Result>,
): Input<InferredSchema<OptionsSchema>, Result> {
	const schema = z.object(definition.options);

	return (context: ProvidedContext<InferredSchema<OptionsSchema>>) => {
		return definition.produce({
			...context,
			options: schema.parse(context.options),
		});
	};
}
