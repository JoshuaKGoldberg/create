import { BlockWithAddons, BlockWithoutAddons } from "../types/blocks.js";
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
	addons: Addons;
}

export interface BlockProductionSettingsWithoutAddons<Options extends object> {
	created?: Partial<IndirectCreation<Options>>;
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
	return (block as BlockWithAddons<Addons, Options>).produce({
		addons: (settings as BlockProductionSettingsWithAddons<Addons, Options>)
			.addons,
		options: settings.options,
	});
}
