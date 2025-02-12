import {
	AnyShape,
	InferredObject,
	produceTemplate,
	SystemContext,
	Template,
} from "bingo";
import { Preset } from "bingo-stratum";
import { createMockSystems } from "bingo-testers";

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
