import { mergeCreations } from "../mergers/mergeCreations.js";
import {
	BlockContextWithAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "../types/blocks.js";
import { Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";

export type ProduceBlockSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? ProduceBlockSettingsWithAddons<Addons, Options>
	: ProduceBlockSettingsWithoutAddons<Options>;

export interface ProduceBlockSettingsWithAddons<
	Addons extends object,
	Options extends object,
> extends ProduceBlockSettingsWithoutAddons<Options> {
	addons?: Addons;
}

export interface ProduceBlockSettingsWithoutAddons<Options extends object> {
	mode?: ProductionMode;
	offline?: boolean;
	options: Options;
}

export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: ProduceBlockSettingsWithAddons<Addons, Options>,
): Partial<Creation<Options>>;
export function produceBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: ProduceBlockSettingsWithoutAddons<Options>,
): Partial<Creation<Options>>;
export function produceBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: ProduceBlockSettings<Addons, Options>,
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
