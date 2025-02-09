import { AnyShape, InferredObject } from "../options.js";
import { Template } from "../types/templates.js";

export type CreateConfigSettings<Options extends object = object> =
	CreatedConfigSettings<Options>;

export interface CreatedConfig<OptionsShape extends AnyShape = AnyShape> {
	settings?: CreatedConfigSettings<InferredObject<OptionsShape>>;
	template: Template<OptionsShape>;
}

export interface CreatedConfigSettings<Options extends object = object> {
	options?: Options;
}
