import * as fs from "node:fs/promises";

import { createReadingFileSystem } from "./createReadingFileSystem.js";
import { CreatedFileOptions } from "./types/files.js";

export function createWritingFileSystem() {
	return {
		...createReadingFileSystem(),
		writeDirectory: async (directoryPath: string) =>
			void (await fs.mkdir(directoryPath, { recursive: true })),
		writeFile: async (
			filePath: string,
			contents: string,
			options?: CreatedFileOptions,
		) => {
			await fs.writeFile(filePath, contents, {
				mode: options?.executable ? 0x755 : 0x644,
			});
		},
	};
}
