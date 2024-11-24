import {
	BlockWithAddons,
	BlockWithoutAddons,
	Creation,
	IndirectCreation,
} from "create";

import { createFailingObject, failingFunction } from "./utils.js";

export interface BlockContextSettingsWithoutAddons<Options extends object> {
	created?: Partial<IndirectCreation<Options>>;
	options?: Options;
}

export interface BlockContextSettingsWithRequiredAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextSettingsWithoutAddons<Options> {
	addons: Addons;
}

export interface BlockContextSettingsWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextSettingsWithoutAddons<Options> {
	addons?: Addons;
}

export function testBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: BlockContextSettingsWithRequiredAddons<Addons, Options>,
): Partial<Creation<Options>>;
export function testBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings?: BlockContextSettingsWithoutAddons<Options>,
): Partial<Creation<Options>>;
export function testBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: BlockContextSettingsWithOptionalAddons<Addons, Options> = {},
): Partial<Creation<Options>> {
	return block.produce({
		get addons() {
			return failingFunction("addons", "the Block");
		},
		options: createFailingObject("options", "the Block") as Options,
		...settings,
	});
}
