import * as path from "node:path";
import prettier from "prettier";

import { CreatedFiles } from "../types/creations.js";
import { WritingFileSystem } from "../types/system.js";

export async function applyFilesToSystem(
	files: CreatedFiles,
	system: WritingFileSystem,
	rootDirectory: string,
) {
	await writeToSystemWorker(files, system, rootDirectory);
}

async function writeToSystemWorker(
	files: CreatedFiles,
	system: WritingFileSystem,
	basePath: string,
) {
	await system.writeDirectory(basePath);

	for (const [fileName, contents] of Object.entries(files)) {
		if (typeof contents === "string") {
			await system.writeFile(
				path.join(basePath, fileName),
				await format(fileName, contents),
			);
		} else if (Array.isArray(contents)) {
			await system.writeFile(
				path.join(basePath, fileName),
				await format(fileName, contents[0]),
				contents[1],
			);
		} else if (typeof contents === "object") {
			await writeToSystemWorker(
				contents,
				system,
				path.join(basePath, fileName),
			);
		}
	}
}

async function format(fileName: string, text: string) {
	const parser = inferParser(fileName, text);
	if (!parser) {
		return text;
	}

	return await prettier.format(text, {
		parser,
		useTabs: true,
	});
}

function inferParser(fileName: string, text: string) {
	if (text.startsWith("{")) {
		return "json";
	}

	switch (fileName.split(".").at(-1)) {
		case "cjs":
		case "js":
			return "babel";
		case "json":
			return "json";
		case "md":
			return "markdown";
		case "yml":
			return "yaml";
	}

	return undefined;
}
