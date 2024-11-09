import { Preset } from "../types/presets.js";
import { Template } from "../types/templates.js";

export function isPreset(value: unknown): value is Preset {
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
		Array.isArray(value.presets)
	);
}
