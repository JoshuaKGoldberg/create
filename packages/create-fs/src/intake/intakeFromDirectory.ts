import * as fs from "node:fs/promises";
import path from "node:path";

import { CreatedDirectory } from "../types/files.js";

export interface IntakeFromDirectorySettings {
	exclude: RegExp;
}

export async function intakeFromDirectory(
	directoryPath: string,
	settings: IntakeFromDirectorySettings,
) {
	const files: CreatedDirectory = {};
	const children = await fs.readdir(directoryPath);

	for (const child of children) {
		if (settings.exclude.test(child)) {
			continue;
		}

		const childPath = path.join(directoryPath, child);
		const stat = await fs.stat(childPath);

		files[child] = stat.isDirectory()
			? await intakeFromDirectory(childPath, settings)
			: [(await fs.readFile(childPath)).toString(), { mode: stat.mode }];
	}

	return files;
}
