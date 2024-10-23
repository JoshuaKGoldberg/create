// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/unified-signatures */

import { InferredObject } from "../options.js";
import { runPreset } from "../runners/runPreset.js";
import { createSystemContext } from "../system/createSystemContext.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";
import { awaitCalledProperties } from "../utils/awaitCalledProperties.js";

export interface ProductionSettingsBase {
	system?: SystemContext;
}

export interface AugmentingPresetProductionSettings<Options extends {}>
	extends ProductionSettingsBase {
	options?: Partial<InferredObject<Options>>;
	optionsAugment: (
		options: Partial<InferredObject<Options>>,
	) => Promise<InferredObject<Options>>;
}

export interface FullPresetProductionSettings<Options extends {}>
	extends ProductionSettingsBase {
	options: InferredObject<Options>;
	optionsAugment?: (
		options: InferredObject<Options>,
	) => Promise<Partial<InferredObject<Options>>>;
}

export async function producePreset<Options extends {}>(
	preset: Preset<Options>,
	settings: AugmentingPresetProductionSettings<Options>,
): Promise<Creation>;
export async function producePreset<Options extends {}>(
	preset: Preset<Options>,
	settings: FullPresetProductionSettings<Options>,
): Promise<Creation>;
export async function producePreset<Options extends {}>(
	preset: Preset<Options>,
	{
		options,
		optionsAugment,
		system = createSystemContext(),
	}:
		| AugmentingPresetProductionSettings<Options>
		| FullPresetProductionSettings<Options>,
): Promise<Creation> {
	// From api/produce-preset.md,
	// Preset options are generated through three steps:
	// 1. Any options provided by producePreset's second parameter's options
	const providedOptions = options ?? {};

	// 2. Calling the Preset's Schema's produce method, if it exists
	const producedOptions =
		preset.schema.produce &&
		(await awaitCalledProperties(
			preset.schema.produce({
				options: providedOptions,
				take: system.take,
			}),
		));

	// 3. Calling to an optional optionsAugment method of producePreset's second parameter
	const optionsForAugmentation = {
		...producedOptions,
		...providedOptions,
	} as InferredObject<Options>;
	const augmentedOptions = await optionsAugment?.(optionsForAugmentation);

	return await runPreset(
		preset,
		{
			...optionsForAugmentation,
			...augmentedOptions,
		} as InferredObject<Options>,
		system,
	);
}
