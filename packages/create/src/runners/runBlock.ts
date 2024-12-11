import { produceBlock } from "../producers/produceBlock.js";
import { createSystemContext } from "../system/createNativeSystems.js";
import { BlockWithAddons, BlockWithoutAddons } from "../types/blocks.js";
import { IndirectCreation } from "../types/creations.js";
import { NativeSystem } from "../types/system.js";
import { applyCreation } from "./applyCreation.js";

export interface BlockRunSettingsWithoutAddons<Options extends object>
	extends Partial<NativeSystem> {
	created?: Partial<IndirectCreation<Options>>;
	options: Options;
	rootDirectory?: string;
}

export interface BlockRunSettingsWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockRunSettingsWithoutAddons<Options> {
	addons?: Addons;
}

export interface BlockRunSettingsWithRequiredAddons<
	Addons extends object,
	Options extends object,
> extends BlockRunSettingsWithoutAddons<Options> {
	addons: Addons;
}

export type BlockRunSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? BlockRunSettingsWithOptionalAddons<Addons, Options>
	: BlockRunSettingsWithoutAddons<Options>;

export async function runBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: BlockRunSettingsWithOptionalAddons<Addons, Options>,
): Promise<void>;
export async function runBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: BlockRunSettingsWithoutAddons<Options>,
): Promise<void>;
export async function runBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: BlockRunSettings<Addons, Options>,
): Promise<void> {
	const system = createSystemContext(settings);

	const creation = produceBlock(
		// TODO: Why are these assertions necessary?
		block as BlockWithAddons<Addons, Options>,
		settings as BlockRunSettingsWithRequiredAddons<Addons, Options>,
	);

	await applyCreation(creation, system, settings.rootDirectory);
}