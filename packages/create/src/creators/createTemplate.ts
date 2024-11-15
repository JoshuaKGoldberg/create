import { AnyShape } from "../options.js";
import { Template, TemplateDefinition } from "../types/templates.js";

export const createTemplate = <
	Label extends string,
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
>(
	templateDefinition: TemplateDefinition<Label, MetadataShape, OptionsShape>,
): Template<Label, MetadataShape, OptionsShape> => {
	return templateDefinition;
};
