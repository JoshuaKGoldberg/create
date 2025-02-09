import { CreatedConfig } from "../config/types.js";
import { isTemplate } from "./isTemplate.js";

export function isCreatedConfig(value: unknown): value is CreatedConfig {
	return (
		!!value &&
		typeof value === "object" &&
		"settings" in value &&
		typeof value.settings === "object" &&
		!!value.settings &&
		"template" in value &&
		isTemplate(value.template)
	);
}
