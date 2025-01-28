import {
	AnyShape,
	InferredObject,
	Preset,
	produceTemplate,
	SystemContext,
	Template,
} from "create";

import { createMockSystems } from "./createMockSystems.js";

export interface TestProductionSettingsBase {
	system?: Omit<Partial<SystemContext>, "take">;
}

export interface TestTemplateProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
	preset: Preset<OptionsShape> | string;
}

export async function testTemplate<OptionsShape extends AnyShape>(
	template: Template<OptionsShape>,
	settings: TestTemplateProductionSettings<OptionsShape>,
) {
	const { system } = createMockSystems(settings.system);

	return await produceTemplate(template, { ...settings, ...system });
}
