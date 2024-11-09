import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export interface TemplatePresetListing<
	Label extends string,
	OptionsShape extends AnyShape = AnyShape,
> {
	label: Label;
	preset: Preset<OptionsShape>;
}

export interface TemplateDefinition<
	Label extends string,
	OptionsShape extends AnyShape = AnyShape,
> {
	about?: AboutBase;
	default: Label;
	presets: TemplatePresetListing<Label, OptionsShape>[];
}

export type Template<
	Label extends string = string,
	OptionsShape extends AnyShape = AnyShape,
> = TemplateDefinition<Label, OptionsShape>;
