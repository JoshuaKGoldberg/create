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

export interface InputDefinitionWithArgs<
	Result,
	ArgsSchema extends AnyShape | undefined,
> {
	args: ArgsSchema;
	produce: Input<Result, InferredObject<ArgsSchema>>;
}

export interface InputDefinitionWithoutArgs<Result> {
	produce: Input<Result>;
}

export function createInput<
	Result,
	ArgsSchema extends AnyShape | undefined = undefined,
>(
	inputDefinition: InputDefinition<Result, ArgsSchema>,
): Input<Result, InferredObject<ArgsSchema>> {
	if (!isDefinitionWithArgs(inputDefinition)) {
		return ((context: InputContext) => {
			return inputDefinition.produce(context);
		}) as Input<Result, InferredObject<ArgsSchema>>;
	}

	const base = z.object(inputDefinition.args);

	return ((
		context: InputContextWithArgs<InferredObject<NonNullable<ArgsSchema>>>,
	) => {
		return inputDefinition.produce({
			...context,
			args: base.parse(context.args),
		});
	}) as Input<Result, InferredObject<ArgsSchema>>;
}
