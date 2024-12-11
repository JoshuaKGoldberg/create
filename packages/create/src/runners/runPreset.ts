import { AnyShape, InferredObject } from "../options.js";
import { producePreset } from "../producers/producePreset.js";
import { createSystemContext } from "../system/createNativeSystems.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { PromiseOrSync } from "../utils/promises.js";
import { applyCreation } from "./applyCreation.js";

export interface RunSettingsBase extends Partial<NativeSystem> {
	rootDirectory?: string;
}

export interface AugmentingPresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options?: Partial<InferredObject<OptionsShape>>;
	optionsAugment: (
		options: Partial<InferredObject<OptionsShape>>,
	) => PromiseOrSync<InferredObject<OptionsShape>>;
}

export interface FullPresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options: InferredObject<OptionsShape>;
	optionsAugment?: (
		options: InferredObject<OptionsShape>,
	) => Promise<Partial<InferredObject<OptionsShape>>>;
}

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings:
		| AugmentingPresetRunSettings<OptionsShape>
		| FullPresetRunSettings<OptionsShape>,
): Promise<void> {
	const system = createSystemContext(settings);

	const creation = await producePreset(
		preset,
		// TODO: Why is this assertion necessary?
		{
			...system,
			...settings,
		} as FullPresetRunSettings<OptionsShape>,
	);

	await applyCreation(creation, system, settings.rootDirectory);
}
