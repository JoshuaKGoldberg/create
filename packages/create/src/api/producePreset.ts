// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/unified-signatures */

import { InferredObject } from "../options.js";
import { runPreset } from "../runners/runPreset.js";
import { createSystemContext } from "../system/createSystemContext.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { System } from "../types/system.js";
import { awaitCalledProperties } from "../utils/awaitCalledProperties.js";

export interface ProductionSettingsBase<Options extends {}> {
	preset: Preset<Options>;
	system?: System;
}

export interface AugmentingPresetProductionSettings<Options extends {}>
	extends ProductionSettingsBase<Options> {
	augmentOptions: (
		options: Partial<InferredObject<Options>>,
	) => Promise<InferredObject<Options>>;
	options: Partial<InferredObject<Options>>;
}

export interface FullPresetProductionSettings<Options extends {}>
	extends ProductionSettingsBase<Options> {
	augmentOptions?: (
		options: InferredObject<Options>,
	) => Promise<Partial<InferredObject<Options>>>;
	options: InferredObject<Options>;
}

export async function producePreset<Options extends {}>(
	settings: AugmentingPresetProductionSettings<Options>,
): Promise<Creation>;
export async function producePreset<Options extends {}>(
	settings: FullPresetProductionSettings<Options>,
): Promise<Creation>;
export async function producePreset<Options extends {}>({
	augmentOptions,
	options: providedOptions,
	preset,
	system = createSystemContext(),
}:
	| AugmentingPresetProductionSettings<Options>
	| FullPresetProductionSettings<Options>): Promise<Creation> {
	const producedOptions =
		preset.schema.produce &&
		(await awaitCalledProperties(
			preset.schema.produce({
				options: providedOptions,
				take: system.take,
			}),
		));

	const optionsForAugmentation = {
		...providedOptions,
		...producedOptions,
	} as InferredObject<Options>;

	const augmentedOptions = await augmentOptions?.(optionsForAugmentation);

	const creationOptions = {
		...optionsForAugmentation,
		...augmentedOptions,
	} as InferredObject<Options>;

	return await runPreset(preset, creationOptions, system);
}
