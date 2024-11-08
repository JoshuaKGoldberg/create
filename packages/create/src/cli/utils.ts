import { Preset } from "../types/presets.js";

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
