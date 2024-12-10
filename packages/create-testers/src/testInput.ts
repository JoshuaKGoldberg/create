import { Input, TakeInput } from "create";

import { createMockSystems } from "./createMockSystems.js";
import { MockSystemOptions } from "./types.js";

export interface InputContextSettingsWithoutArgs extends MockSystemOptions {
	take?: TakeInput;
}

export interface InputContextSettingsWithArgs<Args extends object>
	extends InputContextSettingsWithoutArgs {
	args: Args;
}

export function testInput<Result, Args extends object>(
	input: Input<Result, Args>,
	settings: Partial<InputContextSettingsWithArgs<Args>> = {},
) {
	const { system, take } = createMockSystems(settings);

	return input({
		...(settings as InputContextSettingsWithArgs<Args>),
		...system,
		take,
	});
}
