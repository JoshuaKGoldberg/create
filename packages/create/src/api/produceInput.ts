import { createNativeSystems } from "../system/createNativeSystems.js";
import { Input } from "../types/inputs.js";
import { NativeSystem } from "../types/system.js";

export interface InputProductionSettings<Args extends object = object>
	extends Partial<NativeSystem> {
	args: Args;
}

export function produceInput<Result, Args extends object>(
	input: Input<Result, Args>,
	settings: InputProductionSettings<Args>,
) {
	const { system, take } = createNativeSystems(settings);

	return input({
		args: settings.args,
		take,
		...system,
	});
}
