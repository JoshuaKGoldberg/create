import { AnyShape } from "../options.js";
import { Template } from "../types/templates.js";

export function isTemplate(
	value: unknown,
): value is Template<string, AnyShape, AnyShape> {
	return (
		!!value &&
		typeof value === "object" &&
		"presets" in value &&
		Array.isArray(value.presets)
	);
}
