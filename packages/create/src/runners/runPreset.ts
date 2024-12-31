import fs from "node:fs/promises";

import { AnyShape, InferredObject } from "../options.js";
import { producePreset } from "../producers/producePreset.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { applyCreation } from "./applyCreation.js";

export interface AugmentingPresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options?: Partial<InferredObject<OptionsShape>>;
}

export interface PresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options: InferredObject<OptionsShape>;
}

export interface RunSettingsBase extends Partial<NativeSystem> {
	auth?: string;
	directory?: string;
	mode?: ProductionMode;
}

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: PresetRunSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const { directory = "." } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const creation = await producePreset(preset, { ...system, ...settings });

	await applyCreation(creation, system);

	return creation;
}
