import {
	AnyShape,
	createSystemContext,
	InferredObject,
	ProduceTemplateSettings,
} from "bingo";

import { BlockCreation, CreatedBlockAddons } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { BlockModifications } from "../types/settings.js";
import { applyBlockModifications } from "./applyBlockModifications.js";
import { produceBlocks } from "./produceBlocks.js";

export interface ProducePresetSettings<OptionsShape extends AnyShape>
	extends ProduceTemplateSettings<OptionsShape> {
	// TODO: Get this to work with object or never...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons?: CreatedBlockAddons<any, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
}

export function producePreset<OptionsShape extends AnyShape>(
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
): BlockCreation<InferredObject<OptionsShape>> {
	const system = createSystemContext({
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
