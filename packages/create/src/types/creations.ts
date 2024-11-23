// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { BlockDataWithArgs } from "./blocks.js";

export interface DirectCreation {
	commands: (CreatedCommand | string)[];
	files: CreatedFiles;
	// TODO: Network calls
}

export interface IndirectCreation<Options> {
	addons: BlockDataWithArgs<object, Options>[];
}

export type Creation<Options> = DirectCreation & IndirectCreation<Options>;

export interface CreatedCommand {
	phase: number; // TODO: Make an enum?
	script: string;
}

export interface CreatedFiles {
	[i: string]: CreatedFileEntry | undefined;
}

export type CreatedFileEntry = CreatedFiles | false | string;
