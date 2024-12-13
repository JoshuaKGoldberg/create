// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/unified-signatures */

import { ProductionMode } from "../modes/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { createSystemContext } from "../system/createSystemContext.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { PromiseOrSync } from "../utils/promises.js";
import { executePresetBlocks } from "./executePresetBlocks.js";
import { produceBase } from "./produceBase.js";

export interface Production<Options extends object> {
	creation: Creation<Options>;
	options: Options;
}

export interface ProductionSettingsBase {
	directory?: string;
	mode?: ProductionMode;
}

export interface AugmentingPresetProductionSettings<
	OptionsShape extends AnyShape,
> extends ProductionSettingsBase,
		Partial<NativeSystem> {
	options?: Partial<InferredObject<OptionsShape>>;
	optionsAugment: (
		options: Partial<InferredObject<OptionsShape>>,
	) => PromiseOrSync<InferredObject<OptionsShape>>;
}

export interface FullPresetProductionSettings<OptionsShape extends AnyShape>
	extends ProductionSettingsBase,
		Partial<NativeSystem> {
	options: InferredObject<OptionsShape>;
	optionsAugment?: (
		options: InferredObject<OptionsShape>,
	) => Promise<Partial<InferredObject<OptionsShape>>>;
}

export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: AugmentingPresetProductionSettings<OptionsShape>,
): Promise<Production<InferredObject<OptionsShape>>>;
export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: FullPresetProductionSettings<OptionsShape>,
): Promise<Production<InferredObject<OptionsShape>>>;
export async function producePreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	{
		directory = ".",
		mode,
		options,
		optionsAugment,
		...providedSystem
	}:
		| AugmentingPresetProductionSettings<OptionsShape>
		| FullPresetProductionSettings<OptionsShape>,
): Promise<Production<InferredObject<OptionsShape>>> {
	const system = createSystemContext({
		directory,
		...providedSystem,
	});

	// From engine/apis/producers.md > `optionsAugment`,
	// Preset options are generated through three steps...

	// 1. Any options provided by producePreset's second parameter's options
	const providedOptions = options ?? {};

	// 2. Calling the Preset's Base's produce method, if it exists
	const producedOptions = await produceBase(preset.base, {
		options: providedOptions,
		...system,
	});

	// 3. Calling to an optional optionsAugment method of producePreset's second parameter
	const optionsForAugmentation = {
		...producedOptions,
		...providedOptions,
	} as InferredObject<OptionsShape>;
	const augmentedOptions = await optionsAugment?.(optionsForAugmentation);
	const fullOptions = {
		...optionsForAugmentation,
		...augmentedOptions,
	} as InferredObject<OptionsShape>;

	const creation = executePresetBlocks(
		preset,
		fullOptions,
		{ ...system, directory },
		mode,
	);

	return { creation, options: fullOptions };
}
