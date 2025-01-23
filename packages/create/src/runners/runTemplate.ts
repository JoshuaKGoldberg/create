import fs from "node:fs/promises";

import { BlockModifications } from "../config/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { produceTemplate } from "../producers/produceTemplate.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { Template } from "../types/templates.js";
import { runCreation } from "./runCreation.js";

export interface RunSettingsBase extends Partial<NativeSystem> {
	auth?: string;
	directory?: string;
	mode?: ProductionMode;
	offline?: boolean;
}

export interface RunTemplateSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	addons?: CreatedBlockAddons<object, InferredObject<OptionsShape>>[];
	blocks?: BlockModifications<InferredObject<OptionsShape>>;
	offline?: boolean;
	options: InferredObject<OptionsShape>;
	preset: Preset<OptionsShape> | string;
}

export async function runTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	settings: RunTemplateSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const { directory = ".", offline } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const creation = await produceTemplate(template, { ...system, ...settings });

	await runCreation(creation, { offline, system });

	return creation;
}
