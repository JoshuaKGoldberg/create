import * as nodeFS from "node:fs/promises";

export function createWritingFileSystem() {
	return {
		readFile: async (filePath: string) =>
			(await nodeFS.readFile(filePath)).toString(),
		writeDirectory: async (directoryPath: string) =>
			void (await nodeFS.mkdir(directoryPath, { recursive: true })),
		writeFile: async (filePath: string, contents: string) => {
			await nodeFS.writeFile(filePath, contents);
		},
	};
}
