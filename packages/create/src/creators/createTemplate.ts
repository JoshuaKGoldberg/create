import { AnyShape } from "../options.js";
import { Template, TemplateDefinition } from "../types/templates.js";

export const createTemplate = <
	OptionsShape extends AnyShape,
	Presets extends string,
>(
	templateDefinition: TemplateDefinition<OptionsShape, Presets>,
): Template<OptionsShape, Presets> => {
	return templateDefinition;
};
