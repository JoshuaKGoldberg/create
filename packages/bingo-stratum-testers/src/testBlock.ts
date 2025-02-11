import {
	BlockWithAddons,
	BlockWithoutAddons,
	Creation,
	produceBlock,
	ProduceBlockSettingsWithAddons,
	ProductionMode,
} from "bingo";

import { createFailingObject } from "./utils.js";

export interface BlockContextSettingsWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextSettingsWithoutAddons<Options> {
	addons?: Partial<Addons>;
}

export interface BlockContextSettingsWithoutAddons<Options extends object> {
	mode?: ProductionMode;
	options?: Options;
}

export function testBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: BlockContextSettingsWithOptionalAddons<Addons, Options>,
): Partial<Creation<Options>>;
export function testBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings?: BlockContextSettingsWithoutAddons<Options>,
): Partial<Creation<Options>>;
export function testBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: BlockContextSettingsWithOptionalAddons<Addons, Options> = {},
): Partial<Creation<Options>> {
	return produceBlock(
		block as BlockWithAddons<Addons, Options>,
		{
			addons: {},
			options: createFailingObject("options", "the Block") as Options,
			...settings,
		} as ProduceBlockSettingsWithAddons<Addons, Options>,
	);
}
