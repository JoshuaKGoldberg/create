import { AnyShape } from "../options.js";
import { AboutBase } from "./about.js";
import { Preset } from "./presets.js";

export interface TemplatePresetListing<
	Label extends string,
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> {
	label: Label;
	preset: Preset<MetadataShape, OptionsShape>;
}

export interface TemplateDefinition<
	Label extends string,
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> {
	about?: AboutBase;
	default: Label;
	presets: TemplatePresetListing<Label, MetadataShape, OptionsShape>[];
}

export type Template<
	Label extends string,
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
> = TemplateDefinition<Label, MetadataShape, OptionsShape>;
