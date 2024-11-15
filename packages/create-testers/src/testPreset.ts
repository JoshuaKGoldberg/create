import {
	AnyShape,
	Creation,
	FullPresetProductionSettings,
	InferredObject,
	Preset,
	producePreset,
	PromiseOrSync,
	SystemContext,
} from "create";

import { createMockSystems } from "./createMockSystems.js";

export interface TestProductionSettingsBase {
	system?: Omit<Partial<SystemContext>, "take">;
}

export interface TestAugmentingPresetProductionSettings<
	OptionsShape extends AnyShape,
> extends TestProductionSettingsBase {
	options?: Partial<InferredObject<OptionsShape>>;
	optionsAugment: (
		options: Partial<InferredObject<OptionsShape>>,
	) => PromiseOrSync<InferredObject<OptionsShape>>;
}

export interface TestFullPresetProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
	optionsAugment?: (
		options: InferredObject<OptionsShape>,
	) => Promise<Partial<InferredObject<OptionsShape>>>;
}

export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: TestAugmentingPresetProductionSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>>;
export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	// TODO: When removing this, optionsAugment's options param is implicitly any.
	// Is that a TS bug? Bug in typescript-eslint? To be investigated.
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	settings: TestFullPresetProductionSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>>;
export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings:
		| TestAugmentingPresetProductionSettings<OptionsShape>
		| TestFullPresetProductionSettings<OptionsShape>,
) {
	const { system } = createMockSystems(settings.system);

	return await producePreset(preset, {
		...settings,
		...system,
	} as FullPresetProductionSettings<OptionsShape>);
}
