import { BlockModifications } from "../config/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { applyBlockModifications } from "./applyBlockModifications.js";
import { produceBlocks } from "./produceBlocks.js";

export interface ProducePresetSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	// TODO: Get this to work with object or never...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons?: CreatedBlockAddons<any, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
	directory?: string;
	mode?: ProductionMode;
	offline?: boolean;
	options: InferredObject<OptionsShape>;
}

export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	{
		addons,
		blocks: blockModifications,
		directory = ".",
		mode,
		offline,
		options,
		...providedSystem
	}: ProducePresetSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const system = await createSystemContextWithAuth({
		directory,
		offline,
		...providedSystem,
	});

	const blocks = applyBlockModifications(preset.blocks, blockModifications);

	const creation = produceBlocks(blocks, {
		addons,
		mode,
		offline,
		options,
		system: { ...system, directory },
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
