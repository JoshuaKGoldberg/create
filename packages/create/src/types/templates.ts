import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export type Template<
	OptionsShape extends AnyShape = AnyShape,
	Presets extends string = string,
> = TemplateDefinition<OptionsShape, Presets>;

export interface TemplateDefinition<
	OptionsShape extends AnyShape,
	Presets extends string,
> {
	about?: AboutBase;
	default: NoInfer<Presets>;
	presets: Record<Presets, TemplatePresetListing<OptionsShape>>;
}

export interface TemplatePresetListing<
	OptionsShape extends AnyShape = AnyShape,
> {
	label: string;
	preset: Preset<OptionsShape>;
}
