import { produceBlock } from "../producers/produceBlock.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { BlockWithAddons, BlockWithoutAddons } from "../types/blocks.js";
import { IndirectCreation } from "../types/creations.js";
import { NativeSystem } from "../types/system.js";
import { runCreation } from "./runCreation.js";

export type RunBlockSettings<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? RunBlockSettingsWithOptionalAddons<Addons, Options>
	: RunBlockSettingsWithoutAddons<Options>;

export interface RunBlockSettingsWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends RunBlockSettingsWithoutAddons<Options> {
	addons?: Addons;
}

export interface RunBlockSettingsWithoutAddons<Options extends object>
	extends Partial<NativeSystem> {
	created?: Partial<IndirectCreation<Options>>;
	directory?: string;
	offline?: boolean;
	options: Options;
}

export interface RunBlockSettingsWithRequiredAddons<
	Addons extends object,
	Options extends object,
> extends RunBlockSettingsWithoutAddons<Options> {
	addons: Addons;
}

export async function runBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options>,
	settings: RunBlockSettingsWithOptionalAddons<Addons, Options>,
): Promise<void>;
export async function runBlock<Options extends object>(
	block: BlockWithoutAddons<Options>,
	settings: RunBlockSettingsWithoutAddons<Options>,
): Promise<void>;
export async function runBlock<Addons extends object, Options extends object>(
	block: BlockWithAddons<Addons, Options> | BlockWithoutAddons<Options>,
	settings: RunBlockSettings<Addons, Options>,
): Promise<void> {
	const { directory = ".", offline } = settings;
	const system = await createSystemContextWithAuth({ directory, ...settings });

	const creation = produceBlock(
		// TODO: Why are these assertions necessary?
		block as BlockWithAddons<Addons, Options>,
		settings as RunBlockSettingsWithRequiredAddons<Addons, Options>,
	);

	await runCreation(creation, { offline, system });
}
