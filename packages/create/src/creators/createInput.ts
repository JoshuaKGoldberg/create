import { z } from "zod";

import { AnyOptionsSchema, InferredSchema } from "../options";
import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "../types/context";
import { Input } from "../types/inputs";
import { isDefinitionWithOptions } from "./utils";

export type InputDefinition<
	Result,
	OptionsSchema extends AnyOptionsSchema | undefined = undefined,
> = OptionsSchema extends object
	? InputDefinitionWithOptions<Result, OptionsSchema>
	: InputDefinitionWithoutOptions<Result>;

export interface InputDefinitionWithoutOptions<Result> {
	produce: Input<Result>;
}

export interface InputDefinitionWithOptions<
	Result,
	OptionsSchema extends AnyOptionsSchema | undefined,
> {
	options: OptionsSchema;
	produce: Input<Result, InferredSchema<OptionsSchema>>;
}

export function createInput<
	Result,
	OptionsSchema extends AnyOptionsSchema | undefined = undefined,
>(
	definition: InputDefinition<Result, OptionsSchema>,
): Input<Result, InferredSchema<OptionsSchema>> {
	if (!isDefinitionWithOptions(definition)) {
		return ((context: CreationContextWithoutOptions) => {
			return definition.produce(context);
		}) as Input<Result, InferredSchema<OptionsSchema>>;
	}

	const schema = z.object(definition.options);

	return ((
		context: CreationContextWithOptions<InferredSchema<OptionsSchema>>,
	) => {
		return definition.produce({
			...context,
			options: schema.parse(context.options),
		});
	}) as Input<Result, InferredSchema<OptionsSchema>>;
}
