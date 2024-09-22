import { z } from "zod";

import { AnyShape, InferredObject } from "../options.js";
import { Input, InputContext, InputContextWithArgs } from "../types/inputs.js";
import { isDefinitionWithArgs } from "./utils.js";

export type InputDefinition<
	Result,
	ArgsSchema extends AnyShape | undefined = undefined,
> = ArgsSchema extends object
	? InputDefinitionWithArgs<Result, ArgsSchema>
	: InputDefinitionWithoutArgs<Result>;

export interface InputDefinitionWithoutArgs<Result> {
	produce: Input<Result>;
}

export interface InputDefinitionWithArgs<
	Result,
	ArgsSchema extends AnyShape | undefined,
> {
	args: ArgsSchema;
	produce: Input<Result, InferredObject<ArgsSchema>>;
}

export function createInput<
	Result,
	ArgsSchema extends AnyShape | undefined = undefined,
>(
	definition: InputDefinition<Result, ArgsSchema>,
): Input<Result, InferredObject<ArgsSchema>> {
	if (!isDefinitionWithArgs(definition)) {
		return ((context: InputContext) => {
			return definition.produce(context);
		}) as Input<Result, InferredObject<ArgsSchema>>;
	}

	const schema = z.object(definition.args);

	return ((context: InputContextWithArgs<InferredObject<ArgsSchema>>) => {
		return definition.produce({
			...context,
			args: schema.parse(context.args),
		});
	}) as Input<Result, InferredObject<ArgsSchema>>;
}
