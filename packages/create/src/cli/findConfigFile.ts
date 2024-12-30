import * as fs from "node:fs/promises";

export async function findConfigFile(directory: string) {
	try {
		return (await fs.readdir(directory)).find(isConfigFileName);
	} catch {
		return undefined;
	}
}

function isConfigFileName(fileName: string) {
	return /create\.config\.\w+/.test(fileName);
}
