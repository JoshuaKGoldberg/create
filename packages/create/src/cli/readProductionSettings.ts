import path from "node:path";

import { ProductionMode } from "../modes/types.js";
import { findConfigFile } from "./findConfigFile.js";
import { ProductionSettings } from "./types.js";

export interface ReadProductionSettingsOptions {
	directory?: string;
	mode?: ProductionMode;
}

export async function readProductionSettings({
	directory,
	mode,
}: ReadProductionSettingsOptions = {}): Promise<Error | ProductionSettings> {
	const configFile = await findConfigFile(directory ?? ".");

	if (configFile && mode === "initialize") {
		return new Error(
			`Cannot run in --mode initialize in a directory that already has a ${configFile}.`,
		);
	}

	if (configFile) {
		return {
			configFile: directory ? path.join(directory, configFile) : configFile,
			mode: "migrate",
		};
	}

	return {
		mode: mode ?? "initialize",
	};
}
