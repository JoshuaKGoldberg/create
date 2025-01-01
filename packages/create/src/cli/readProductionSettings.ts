import * as fs from "node:fs/promises";
import path from "node:path";

import { ProductionMode } from "../types/modes.js";
import { tryCatchAsync } from "../utils/tryCatchAsync.js";
import { ProductionSettings } from "./types.js";

export interface ReadProductionSettingsOptions {
	directory?: string;
	mode?: ProductionMode;
}

export async function readProductionSettings({
	directory = ".",
	mode,
}: ReadProductionSettingsOptions = {}): Promise<Error | ProductionSettings> {
	const items = await tryCatchAsync(fs.readdir(directory));
	let defaultMode: ProductionMode = mode ?? "initialize";

	if (!items) {
		return defaultMode === "migrate"
			? new Error(
					"Cannot run with --mode migrate on a directory that does not yet exist.",
				)
			: { mode: defaultMode };
	}

	for (const item of items) {
		if (/create\.config\.\w+/.test(item)) {
			return {
				configFile: path.join(directory, item),
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
