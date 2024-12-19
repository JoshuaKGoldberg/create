import { ProductionMode } from "../modes/types.js";
import { findConfigFile } from "./findConfigFile.js";
import { ProductionSettings } from "./types.js";

export interface ReadProductionSettingsOptions {
	directory?: string;
	mode?: ProductionMode;
}

export async function readProductionSettings({
	directory = ".",
	mode,
}: ReadProductionSettingsOptions): Promise<ProductionSettings> {
	const configFile = await findConfigFile(directory);
	if (configFile) {
		return {
			configFile,
			mode: "migrate",
		};
	}

	return {
		mode: mode ?? "initialize",
	};
}
