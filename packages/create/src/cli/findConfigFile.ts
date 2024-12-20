import * as fs from "node:fs/promises";

export async function findConfigFile(directory: string) {
	try {
		const children = await fs.readdir(directory);
		let found: string | undefined;

		for (const child of children) {
			if (child === "create.config.ts") {
				return child;
			}

			if (isConfigFileName(child)) {
				found = child;
			}
		}

		return found;
	} catch {
		return undefined;
	}
}

function isConfigFileName(fileName: string) {
	return /create\.config\.\w+/.test(fileName);
}
