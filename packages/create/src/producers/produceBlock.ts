import { mergeCreations } from "../mergers/mergeCreations.js";
import { ProductionMode } from "../modes/types.js";
import {
	BlockContextWithAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";

export type BlockProductionSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? BlockProductionSettingsWithAddons<Addons, Options>
	: BlockProductionSettingsWithoutAddons<Options>;

export interface BlockProductionSettingsWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockProductionSettingsWithoutAddons<Options> {
	addons?: Addons;
}

export interface BlockProductionSettingsWithoutAddons<Options extends object> {
	created?: Partial<IndirectCreation<Options>>;
	mode?: ProductionMode;
	options: Options;
}

export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: BlockProductionSettingsWithAddons<Addons, Options>,
): Partial<Creation<Options>>;
export function produceBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: BlockProductionSettingsWithoutAddons<Options>,
): Partial<Creation<Options>>;
export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: BlockProductionSettings<Addons, Options>,
): Partial<Creation<Options>> {
	let creation = block.produce(
		settings as BlockContextWithAddons<Addons, Options>,
	);

	// From engine/runtime/execution.md:
	// 2.2. If a mode is specified, additionally generate the appropriate Block Creations
	const augment = settings.mode && block[settings.mode];
	if (augment) {
		creation = mergeCreations(
			creation,
			augment(settings as BlockContextWithAddons<Addons, Options>),
		);
	}

	return creation;
}
