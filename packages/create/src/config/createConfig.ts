import { AnyShape, InferredObject } from "../options.js";
import { Template } from "../types/templates.js";
import { CreateConfigSettings, CreatedConfig } from "./types.js";

export function createConfig<OptionsShape extends AnyShape = AnyShape>(
	template: Template<OptionsShape>,
	settings: CreateConfigSettings<InferredObject<OptionsShape>> = {},
): CreatedConfig<OptionsShape> {
	return { settings, template };
}
