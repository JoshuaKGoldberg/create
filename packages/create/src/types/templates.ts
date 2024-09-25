import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export interface TemplateDefinition<OptionsShape extends AnyShape = AnyShape> {
	about?: AboutBase;
	presets: Record<string, Preset<OptionsShape>>;
}

export interface Template<OptionsShape extends AnyShape = AnyShape> {
	about?: AboutBase;
	presets: Record<string, Preset<OptionsShape>>;
}

export type OptionsForTemplate<T extends Template> =
	T extends Template<infer Options> ? Options : never;
