import path from "node:path";

import { CreatedFiles, CreationContext } from "../shared";

export async function runCreationFiles(
	files: CreatedFiles,
	context: CreationContext,
) {
	await writeCreationFiles(files, context, "");
}

async function writeCreationFiles(
	files: CreatedFiles,
	context: CreationContext,
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
