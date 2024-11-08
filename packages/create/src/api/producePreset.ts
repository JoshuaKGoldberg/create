// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/unified-signatures */

import { AnyShape, InferredObject } from "../options.js";
import { runPreset } from "../runners/runPreset.js";
import { createNativeSystems } from "../system/createNativeSystems.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { PromiseOrSync } from "../utils/promises.js";
import { produceSchema } from "./produceSchema.js";

export interface AugmentingPresetProductionSettings<
	OptionsShape extends AnyShape,
> extends Partial<NativeSystem> {
	options?: Partial<InferredObject<OptionsShape>>;
	optionsAugment: (
		options: Partial<InferredObject<OptionsShape>>,
	) => PromiseOrSync<InferredObject<OptionsShape>>;
}

export interface FullPresetProductionSettings<OptionsShape extends AnyShape>
	extends Partial<NativeSystem> {
	options: InferredObject<OptionsShape>;
	optionsAugment?: (
		options: InferredObject<OptionsShape>,
	) => Promise<Partial<InferredObject<OptionsShape>>>;
}

export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: AugmentingPresetProductionSettings<OptionsShape>,
): Promise<Creation>;
export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: FullPresetProductionSettings<OptionsShape>,
): Promise<Creation>;
export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	{
		options,
		optionsAugment,
		...providedSystem
	}:
		| AugmentingPresetProductionSettings<OptionsShape>
		| FullPresetProductionSettings<OptionsShape>,
): Promise<Creation> {
	const { system, take } = createNativeSystems(providedSystem);

	// From api/produce-preset.md,
	// Preset options are generated through three steps...

	// 1. Any options provided by producePreset's second parameter's options
	const providedOptions = options ?? {};

	// 2. Calling the Preset's Schema's produce method, if it exists
	const producedOptions = await produceSchema(preset.schema, {
		options: providedOptions,
		...system,
	});

	// 3. Calling to an optional optionsAugment method of producePreset's second parameter
	const optionsForAugmentation = {
		...producedOptions,
		...providedOptions,
	} as InferredObject<OptionsShape>;
	const augmentedOptions = await optionsAugment?.(optionsForAugmentation);

	return await runPreset(
		preset,
		{
			...optionsForAugmentation,
			...augmentedOptions,
		} as InferredObject<OptionsShape>,
		{
			...system,
			take,
		},
	);
}
