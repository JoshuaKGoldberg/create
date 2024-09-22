// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

export interface DirectCreation {
	commands: string[];
	files: CreatedFiles;
	package: CreatedPackage;
}

export interface IndirectCreation {
	documentation: Record<string, string>;
	editor: CreatedEditor;
	jobs: CreatedJob[];
	metadata: CreatedMetadata[];
}

export type Creation = DirectCreation & IndirectCreation;

export interface CreatedEditor {
	debuggers?: CreatedEditorDebugger[];
	extensions?: string[];
	settings?: Record<string, unknown>;
	tasks?: CreatedEditorTask[];
}

export interface CreatedEditorDebugger {
	[i: string]: unknown;
	name: string;
}

export interface CreatedEditorTask {
	[i: string]: unknown;
	detail: string;
}

export interface CreatedFiles {
	[i: string]: CreatedFileEntry | undefined;
}

export interface CreatedJob {
	name: string;
	steps: CreatedJobStep[];
}

export type CreatedJobStep = { run: string } | { uses: string };

export type CreatedFileEntry = CreatedFiles | false | string;

export interface CreatedMetadata {
	glob: string;
	language?: string;
	type: MetadataFileType;
}

export enum MetadataFileType {
	Built,
	Config,
	Documentation,
	Ignored,
	License,
	Snapshot,
	Source,
	Test,
}

/** @todo Use npm's package.json types? */
export interface CreatedPackage {
	[i: string]: unknown;
	dependencies?: CreatedPackagesWithVersions;
	devDependencies?: CreatedPackagesWithVersions;
	peerDependencies?: CreatedPackagesWithVersions;
	scripts?: CreatedPackageScripts;
}

export interface CreatedPackagesWithVersions {
	[i: string]: string;
}

export interface CreatedPackageScripts {
	[i: string]: string;
}
