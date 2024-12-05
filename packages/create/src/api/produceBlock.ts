import { BlockWithAddons, BlockWithoutAddons } from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";

export interface BlockProductionSettingsWithoutAddons<Options extends object> {
	created?: Partial<IndirectCreation<Options>>;
	options: Options;
}

export interface BlockProductionSettingsWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockProductionSettingsWithoutAddons<Options> {
	addons: Addons;
}

export type BlockProductionSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? BlockProductionSettingsWithAddons<Addons, Options>
	: BlockProductionSettingsWithoutAddons<Options>;

export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: BlockProductionSettingsWithAddons<Addons, Options>,
): Promise<Partial<Creation<Options>>>;
export function produceBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: BlockProductionSettingsWithoutAddons<Options>,
): Promise<Partial<Creation<Options>>>;
export async function produceBlock<
	Addons extends object,
	Options extends object,
>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: BlockProductionSettings<Addons, Options>,
): Promise<Partial<Creation<Options>>> {
	const { addons } = settings as BlockProductionSettingsWithAddons<
		Addons,
		Options
	>;
	let created = (block as BlockWithAddons<Addons, Options>).build({
		addons,
		options: settings.options,
	});

	if (block.finalize) {
		created = await block.finalize({
			addons,
			created: {
				commands: [],
				files: {},
				...created,
			},
			options: settings.options,
		});
	}

	return created;
}
