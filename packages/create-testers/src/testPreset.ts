import {
	AnyShape,
	InferredObject,
	Preset,
	producePreset,
	SystemContext,
} from "create";

import { createMockSystems } from "./createMockSystems.js";

export interface TestPresetProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
}

export interface TestProductionSettingsBase {
	system?: Omit<Partial<SystemContext>, "take">;
}

export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: TestPresetProductionSettings<OptionsShape>,
) {
	const { system } = createMockSystems(settings.system);

	return await producePreset(preset, { ...settings, ...system });
}
