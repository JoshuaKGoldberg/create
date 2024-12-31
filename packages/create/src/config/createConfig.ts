import { Preset } from "../types/presets.js";
import { CreateConfigSettings } from "./types.js";

export function createConfig(preset: Preset, settings?: CreateConfigSettings) {
	return { preset, settings };
}
