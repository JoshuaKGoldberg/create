import {
	BlockWithOptionalArgs,
	BlockWithoutArgs,
	BlockWithRequiredArgs,
	Creation,
	IndirectCreation,
} from "create";

import { createFailingObject, failingFunction } from "./utils.js";

export interface BlockContextSettingsWithoutArgs<Options> {
	created?: Partial<IndirectCreation<Options>>;
	options?: Options;
}

export interface BlockContextSettingsWithRequiredArgs<Args, Options>
	extends BlockContextSettingsWithoutArgs<Options> {
	args: Args;
}

export interface BlockContextSettingsWithOptionalArgs<Args, Options>
	extends BlockContextSettingsWithoutArgs<Options> {
	args?: Args;
}

export function testBlock<Args, Options>(
	block: BlockWithRequiredArgs<Args, Options>,
	settings: BlockContextSettingsWithRequiredArgs<Args, Options>,
): Partial<Creation<Options>>;
export function testBlock<Options>(
	block: BlockWithoutArgs<Options>,
	settings?: BlockContextSettingsWithoutArgs<Options>,
): Partial<Creation<Options>>;
export function testBlock<Args, Options>(
	block: BlockWithOptionalArgs<Args, Options>,
	settings?: BlockContextSettingsWithOptionalArgs<Args, Options>,
): Partial<Creation<Options>>;
export function testBlock<Args, Options>(
	block: BlockWithoutArgs<Options> | BlockWithRequiredArgs<Args, Options>,
	settings: BlockContextSettingsWithOptionalArgs<Args, Options> = {},
): Partial<Creation<Options>> {
	const data = (block as BlockWithOptionalArgs<Args, Options>)(settings.args);

	return data.produce({
		get args() {
			return failingFunction("args", "the Block");
		},
		options: createFailingObject("options", "the Block") as Options,
		...settings,
	});
}
