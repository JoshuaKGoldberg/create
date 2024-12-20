import { AnyShape } from "../options.js";
import { Template, TemplateDefinition } from "../types/templates.js";

export const createTemplate = <OptionsShape extends AnyShape>(
	templateDefinition: TemplateDefinition<OptionsShape>,
): Template<OptionsShape> => {
	return templateDefinition;
};
