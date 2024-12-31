import { BlockModifications } from "../config/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { applyBlockModifications } from "./applyBlockModifications.js";
import { executePresetBlocks } from "./executePresetBlocks.js";

export interface PresetProductionSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem>,
		ProductionSettingsBase {
	addons?: CreatedBlockAddons<object, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
	options: InferredObject<OptionsShape>;
}

export interface ProductionSettingsBase {
	directory?: string;
	mode?: ProductionMode;
}

export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	{
		addons,
		blocks: blockModifications,
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

	const creation = executePresetBlocks({
		addons,
		blocks: applyBlockModifications(preset.blocks, blockModifications),
		mode,
		options,
		presetContext: { ...system, directory },
	});

	return {
		addons: [],
		files: {},
		requests: [],
		scripts: [],
		suggestions: [],
		...creation,
	};
}
