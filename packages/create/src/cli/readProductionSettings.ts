import * as fs from "node:fs/promises";
import path from "node:path";

import { ProductionMode } from "../types/modes.js";
import { ProductionSettings } from "./types.js";

export interface ReadProductionSettingsOptions {
	directory?: string;
	mode?: ProductionMode;
}

export async function readProductionSettings({
	directory,
	mode,
}: ReadProductionSettingsOptions = {}): Promise<Error | ProductionSettings> {
	const items = await fs.readdir(directory ?? ".");
	let defaultMode: ProductionMode = mode ?? "initialize";

	for (const item of items) {
		if (/create\.config\.\w+/.test(item)) {
			return {
				configFile: directory ? path.join(directory, item) : item,
				mode: "migrate",
			};
		}

		if (item === ".git" && mode !== "initialize") {
			defaultMode = "migrate";
		}
	}

	return {
		mode: defaultMode,
	};
}
