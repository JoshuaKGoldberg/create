import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export interface TemplatePresetListing<
	Label extends string,
	OptionsShape extends AnyShape,
> {
	label: Label;
	preset: Preset<OptionsShape>;
}

export interface TemplateDefinition<
	Label extends string,
	OptionsShape extends AnyShape,
> {
	about?: AboutBase;
	default: Label;
	presets: TemplatePresetListing<Label, OptionsShape>[];
}

export type Template<
	Label extends string,
	OptionsShape extends AnyShape,
> = TemplateDefinition<Label, OptionsShape>;
