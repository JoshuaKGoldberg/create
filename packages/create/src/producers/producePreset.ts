import { ProductionMode } from "../modes/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { executePresetBlocks } from "./executePresetBlocks.js";

export interface PresetProductionSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem>,
		ProductionSettingsBase {
	options: InferredObject<OptionsShape>;
}

export interface ProductionSettingsBase {
	directory?: string;
	mode?: ProductionMode;
}

export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	{
		directory = ".",
		mode,
		options,
		...providedSystem
	}: PresetProductionSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const system = await createSystemContextWithAuth({
		directory,
		...providedSystem,
	});

	const creation = executePresetBlocks(
		preset,
		options,
		{ ...system, directory },
		mode,
	);

	return {
		addons: [],
		files: {},
		requests: [],
		scripts: [],
		suggestions: [],
		...creation,
	};
}
