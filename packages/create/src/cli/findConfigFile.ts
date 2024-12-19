import * as fs from "node:fs/promises";

export async function findConfigFile(directory: string) {
	try {
		const children = await fs.readdir(directory);

		return children.find((child) => /create\.config\.\w+/.test(child));
	} catch {
		return false;
	}
}
