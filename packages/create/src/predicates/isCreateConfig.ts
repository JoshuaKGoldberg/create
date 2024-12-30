import { CreateConfig } from "../config/createConfig.js";
import { isPreset } from "./isPreset.js";

export function isCreateConfig(value: unknown): value is CreateConfig {
	return (
		!!value &&
		typeof value === "object" &&
		"preset" in value &&
		isPreset(value.preset)
	);
}
