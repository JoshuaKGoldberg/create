import path from "node:path";

import { CreationContextWithoutOptions } from "../types/context";
import { CreatedFiles } from "../types/creations";

export async function runCreationFiles(
	files: CreatedFiles,
	context: CreationContextWithoutOptions,
) {
	await writeCreationFiles(files, context, "");
}

async function writeCreationFiles(
	files: CreatedFiles,
	context: CreationContextWithoutOptions,
	directory: string,
) {
	for (const [key, value] of Object.entries(files)) {
		switch (typeof value) {
			case "object":
				await writeCreationFiles(files, context, path.join(directory, key));
				break;

			case "string":
				await context.fs.writeFile(path.join(directory, key), value);
				break;
		}
	}
}
