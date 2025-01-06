import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export interface Template<OptionsShape extends AnyShape = AnyShape>
	extends TemplateDefinition<OptionsShape> {
	options: OptionsShape;
}

export interface TemplateDefinition<OptionsShape extends AnyShape> {
	about?: AboutBase;
	presets: Preset<OptionsShape>[];
	suggested?: Preset<OptionsShape>;
}
