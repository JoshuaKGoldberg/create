import { BlockModifications } from "../config/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { Template } from "../types/templates.js";
import { getPresetByName } from "../utils/getPresetByName.js";
import { applyBlockModifications } from "./applyBlockModifications.js";
import { produceBlocks } from "./produceBlocks.js";

export interface ProduceTemplateSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	// TODO: Get this to work with object or never...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons?: CreatedBlockAddons<any, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
	directory?: string;
	mode?: ProductionMode;
	offline?: boolean;
	options: InferredObject<OptionsShape>;
	preset: Preset<OptionsShape> | string;
}

export async function produceTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	{
		addons,
		blocks: blockModifications,
		directory = ".",
		mode,
		offline,
		options,
		preset: requestedPreset,
		...providedSystem
	}: ProduceTemplateSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const system = await createSystemContextWithAuth({
		directory,
		offline,
		...providedSystem,
	});

	const preset = getPresetByName(template.presets, requestedPreset);
	if (preset instanceof Error) {
		throw preset;
	}

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
