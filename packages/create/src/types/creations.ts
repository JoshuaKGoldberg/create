// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { BlockWithAddons } from "./blocks.js";

export interface DirectCreation {
	commands: (CreatedCommand | string)[];
	files: CreatedFiles;
	// TODO: Network calls
}

export interface IndirectCreation<Options extends object> {
	// TODO: Figure out how to replace this with ... never? object?
	// Note it needs to pass tsc both in this repo and in create-typescript-app.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons: CreatedBlockAddons<any, Options>[];
}

export type Creation<Options extends object> = DirectCreation &
	IndirectCreation<Options>;

export interface CreatedBlockAddons<
	Addons extends object,
	Options extends object,
> {
	addons: Addons;
	block: BlockWithAddons<Addons, Options>;
}

export interface CreatedCommand {
	phase: number; // TODO: Make an enum?
	script: string;
}

export interface CreatedFiles {
	[i: string]: CreatedFileEntry | undefined;
}

export type CreatedFileEntry = CreatedFiles | false | string;
