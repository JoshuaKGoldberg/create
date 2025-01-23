import {
	AnyShape,
	InferredObject,
	Preset,
	produceTemplate,
	SystemContext,
} from "create";

import { createMockSystems } from "./createMockSystems.js";

export interface TestProductionSettingsBase {
	system?: Omit<Partial<SystemContext>, "take">;
}

export interface TestTemplateProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
	preset: string;
}

export async function testTemplate<OptionsShape extends AnyShape>(
	template: Preset<OptionsShape>,
	settings: TestTemplateProductionSettings<OptionsShape>,
) {
	const { system } = createMockSystems(settings.system);

	return await produceTemplate(template, { ...settings, ...system });
}
