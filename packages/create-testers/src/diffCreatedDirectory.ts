import {
	CreatedDirectory,
	CreatedFileEntry,
	CreatedFileOptions,
} from "create-fs";
import { createTwoFilesPatch } from "diff";
import path from "node:path";
import { withoutUndefinedProperties } from "without-undefined-properties";

export interface DiffedCreatedDirectory {
	[i: string]: DiffedCreatedDirectory | DiffedCreatedFileEntry | undefined;
}

export type DiffedCreatedFileEntry =
	| [string, DiffedCreatedFileOptions]
	| [string]
	| CreatedFileEntry
	| DiffedCreatedDirectory
	| string;

export interface DiffedCreatedFileOptions {
	mode?: string;
}

export type ProcessText = (text: string, filePath: string) => string;

export function diffCreatedDirectory(
	actual: CreatedDirectory,
	created: CreatedDirectory,
	processText: ProcessText,
): DiffedCreatedDirectory | undefined {
	const result = diffCreatedDirectoryWorker(actual, created, ".", processText);

	return result && withoutUndefinedProperties(result);
}

export function diffCreatedDirectoryWorker(
	actual: CreatedDirectory,
	created: CreatedDirectory,
	pathTo: string,
	processText: ProcessText,
): DiffedCreatedDirectory | undefined {
	const result: DiffedCreatedDirectory = {};

	for (const [childName, childCreated] of Object.entries(created)) {
		if (!(childName in actual)) {
			result[childName] = childCreated;
			continue;
		}

		const childActual = actual[childName];
		const pathToChild = path.join(pathTo, childName);

		const childDiffed = diffCreatedDirectoryChild(
			childActual,
			childCreated,
			pathToChild,
			processText,
		);

		if (childDiffed !== undefined) {
			result[childName] = childDiffed;
		}
	}

	const trimmed = withoutUndefinedProperties(result);

	return Object.keys(trimmed).length === 0 ? undefined : result;
}

function diffCreatedDirectoryChild(
	childActual: CreatedFileEntry | undefined,
	childCreated: CreatedFileEntry | undefined,
	pathToChild: string,
	processText: ProcessText,
): DiffedCreatedFileEntry | undefined {
	if (childActual === undefined) {
		return childCreated;
	}

	if (childCreated === undefined) {
		return undefined;
	}

	if (typeof childActual === "string") {
		if (typeof childCreated === "string") {
			return diffCreatedFileText(
				childActual,
				childCreated,
				pathToChild,
				processText,
			);
		}
	}

	if (Array.isArray(childActual)) {
		if (Array.isArray(childCreated)) {
			const fileDiff = diffCreatedFileText(
				childActual[0],
				childCreated[0],
				pathToChild,
				processText,
			);
			const optionsDiff = diffCreatedFileOptions(
				childActual[1],
				childCreated[1],
				pathToChild,
			);
			return fileDiff || optionsDiff
				? [fileDiff ?? "", optionsDiff ?? {}]
				: undefined;
		}

		if (typeof childCreated === "string") {
			return diffCreatedFileText(
				childActual[0],
				childCreated,
				pathToChild,
				processText,
			);
		}

		return `Mismatched ${pathToChild}: actual is a created file; created is ${typeof childCreated}.`;
	}

	if (Array.isArray(childCreated)) {
		if (typeof childActual === "string") {
			return diffCreatedFileText(
				childActual,
				childCreated[0],
				pathToChild,
				processText,
			);
		}

		return `Mismatched ${pathToChild}: actual is ${typeof childActual}; created is a created file.`;
	}

	if (typeof childActual === "object") {
		if (typeof childCreated === "object") {
			return diffCreatedDirectoryWorker(
				childActual,
				childCreated,
				pathToChild,
				processText,
			);
		}
	}

	return `Mismatched ${pathToChild}: actual is ${typeof childActual}; created is ${typeof childCreated}.`;
}

function diffCreatedFileText(
	actual: string,
	created: string,
	pathToFile: string,
	processText: ProcessText,
) {
	const actualProcessed = processText(created, pathToFile);
	const createdProcessed = processText(actual, pathToFile);

	return actualProcessed === createdProcessed
		? undefined
		: createTwoFilesPatch(
				pathToFile,
				pathToFile,
				actualProcessed,
				createdProcessed,
			).replace(/^Index: .+\n=+\n-{3} .+\n\+{3} .+\n/gmu, "");
}

/**
 * @todo
 * Unclear yet how to represent a diff in the mode...
 * Should a DiffedFileEntry type replace CreatedFileOptions.mode with string?
 */
function diffCreatedFileOptions(
	actual: CreatedFileOptions | undefined,
	created: CreatedFileOptions | undefined,
	pathToFile: string,
): DiffedCreatedFileOptions | undefined {
	if (
		actual?.mode === undefined ||
		created?.mode === undefined ||
		actual.mode === created.mode
	) {
		return undefined;
	}

	return {
		mode: diffCreatedFileText(
			actual.mode.toString(16),
			created.mode.toString(16),
			pathToFile,
			(text) => text,
		),
	};
}
