import { Template } from "../types/templates.js";

// TODO: Is there a more formal way to do this?
export function isLocalPath(from: string) {
	return [".", "/", "~"].includes(from[0]);
}

export function isTemplate(value: unknown): value is Template {
	return (
		!!value &&
		typeof value === "object" &&
		"presets" in value &&
		typeof value.presets === "object"
	);
}
