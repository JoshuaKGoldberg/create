import { AnyShape } from "../options.js";
import { Template, TemplateDefinition } from "../types/templates.js";

export const createTemplate = <
	Label extends string,
	OptionsShape extends AnyShape,
>(
	templateDefinition: TemplateDefinition<Label, OptionsShape>,
): Template<Label, OptionsShape> => {
	return templateDefinition;
};
