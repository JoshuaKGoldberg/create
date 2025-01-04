import fs from "node:fs/promises";

import { BlockModifications } from "../config/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { producePreset } from "../producers/producePreset.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { runCreation } from "./runCreation.js";

export interface RunPresetSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	addons?: CreatedBlockAddons<object, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
	offline?: boolean;
	options: InferredObject<OptionsShape>;
}

export interface RunSettingsBase extends Partial<NativeSystem> {
	auth?: string;
	directory?: string;
	mode?: ProductionMode;
	offline?: boolean;
}

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: RunPresetSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const { directory = ".", offline } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const creation = await producePreset(preset, { ...system, ...settings });

	await runCreation(creation, { offline, system });

	return creation;
}
