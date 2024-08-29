// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

// Creations

import { CreatedMetadata } from "../metadata.js";

export interface Creation {
	commands?: string[];
	files?: CreatedFiles;
	jobs?: CreatedJob[];
	metadata?: CreatedMetadata;
	packages?: CreatedPackages;
	scripts?: CreatedScripts;
}

export type CreationFirstRound = {
	[K in keyof Creation]: ((creation: Creation) => Creation[K]) | Creation[K];
};

export interface CreatedFiles {
	[i: string]: CreatedFileEntry | undefined;
}

export interface CreatedJob {
	name: string;
	steps: CreatedJobStep[];
}

export type CreatedJobStep = { run: string } | { uses: string };

export type CreatedFileEntry = CreatedFiles | false | string;

export interface CreatedPackages {
	dependencies?: CreatedPackagesWithVersions;
	devDependencies?: CreatedPackagesWithVersions;
	peerDependencies?: CreatedPackagesWithVersions;
}

export interface CreatedPackagesWithVersions {
	[i: string]: string;
}

export interface CreatedScripts {
	[i: string]: string;
}
