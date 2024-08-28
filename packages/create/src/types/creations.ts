// Creations

import { CreatedMetadata } from "../metadata";

export interface Creation {
	commands?: string[];
	files?: CreatedFiles;
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
