import { createSystemContext } from "../system/createSystemContext.js";
import { Input } from "../types/inputs.js";
import { NativeSystem } from "../types/system.js";

export interface InputProductionSettings<Args extends object = object>
	extends Partial<NativeSystem> {
	args: Args;
	auth?: string;
	directory?: string;
}

export function produceInput<Result, Args extends object>(
	input: Input<Result, Args>,
	settings: InputProductionSettings<Args>,
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
