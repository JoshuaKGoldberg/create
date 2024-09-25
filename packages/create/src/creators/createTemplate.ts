import { AnyShape } from "../options.js";
import { Template, TemplateDefinition } from "../types/templates.js";

export function createTemplate<OptionsShape extends AnyShape>(
	definition: TemplateDefinition<OptionsShape>,
): Template<OptionsShape> {
	return definition;
}
