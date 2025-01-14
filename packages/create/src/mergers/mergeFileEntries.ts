import { CreatedFileEntry } from "create-fs";

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

	if (firstSettings?.mode !== secondSettings?.mode) {
		throw new Error(
			`Conflicting created file modes at path: '${path.join("/")}'.`,
		);
	}

	const mode = firstSettings?.mode ?? secondSettings?.mode;

	return mode ? [firstFile as string, { mode }] : firstFile;
}

function isBlankEntry(entry: CreatedFileEntry | undefined) {
	return entry === false || entry === undefined;
}
