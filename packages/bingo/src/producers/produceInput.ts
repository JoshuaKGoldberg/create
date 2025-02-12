import { NativeSystem } from "bingo-systems";

import { createSystemContext } from "../contexts/createSystemContext.js";
import { AnyShape, InferredObject } from "../options.js";
import { Input } from "../types/inputs.js";

export interface ProduceInputSettings<Args extends object = object>
	extends Partial<NativeSystem> {
	args: Args;
	auth?: string;
	directory?: string;
	offline?: boolean;
}

export function produceInput<Result, ArgsShape extends AnyShape>(
	input: Input<Result, ArgsShape>,
	settings: ProduceInputSettings<InferredObject<ArgsShape>>,
) {
	const system = createSystemContext({
		directory: settings.directory ?? ".",
		...settings,
	});

	return input({
		args: settings.args,
		...system,
	});
}
