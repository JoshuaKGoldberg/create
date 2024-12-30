import { Template } from "../types/templates.js";

export function isTemplate(value: unknown): value is Template {
	return (
		!!value &&
		typeof value === "object" &&
		"presets" in value &&
		typeof value.presets === "object"
	);
}
