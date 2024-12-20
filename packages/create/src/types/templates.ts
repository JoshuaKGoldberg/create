import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export type Template<OptionsShape extends AnyShape = AnyShape> =
	TemplateDefinition<OptionsShape>;

export interface TemplateDefinition<OptionsShape extends AnyShape> {
	about?: AboutBase;
	presets: Preset<OptionsShape>[];
	suggested?: Preset<OptionsShape>;
}
