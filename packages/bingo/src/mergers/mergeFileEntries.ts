import { CreatedFileEntry } from "bingo-fs";

export function mergeFileEntries(
	first: CreatedFileEntry | undefined,
	second: CreatedFileEntry | undefined,
	path: string[],
): CreatedFileEntry | undefined {
	if (first === second || isBlankEntry(second)) {
		return typeof first === "string" ? first : undefined;
	}

	if (isBlankEntry(first)) {
		return second;
	}

	const [firstFile, firstSettings] = Array.isArray(first) ? first : [first, {}];
	const [secondFile, secondSettings] = Array.isArray(second)
		? second
		: [second, {}];

	if (firstFile !== secondFile) {
		throw new Error(`Conflicting created files at path: '${path.join("/")}'.`);
	}

	if (firstSettings?.executable !== secondSettings?.executable) {
		throw new Error(
			`Conflicting created file executable at path: '${path.join("/")}'.`,
		);
	}

	const executable = firstSettings?.executable ?? secondSettings?.executable;

	return executable ? [firstFile as string, { executable }] : firstFile;
}

function isBlankEntry(entry: CreatedFileEntry | undefined) {
	return entry === false || entry === undefined;
}
