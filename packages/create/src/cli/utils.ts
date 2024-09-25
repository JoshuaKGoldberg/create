import { AnyShape } from "../options.js";
import { Preset } from "../types/presets.js";
import { Template } from "../types/templates.js";

export function isPreset(value: unknown): value is Preset<AnyShape> {
	return (
		!!value &&
		typeof value === "object" &&
		"blocks" in value &&
		Array.isArray(value.blocks) &&
		"schema" in value &&
		typeof value.schema === "object"
	);
}

export function isTemplate(value: unknown): value is Template {
	return (
		!!value &&
		typeof value === "object" &&
		"presets" in value &&
		!!value.presets &&
		typeof value.presets === "object"
	);
}
