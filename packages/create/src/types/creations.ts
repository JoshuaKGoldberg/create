// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { BlockWithAddons } from "./blocks.js";
import { SystemFetchers } from "./system.js";

export interface CreatedBlockAddons<
	Addons extends object,
	Options extends object,
> {
	addons: Addons;
	block: BlockWithAddons<Addons, Options>;
}

export type CreatedFileEntry =
	| [string, CreatedFileOptions]
	| [string]
	| CreatedFiles
	| false
	| string;

export interface CreatedFileOptions {
	/**
	 * File mode (permission and sticky bits) per chmod().
	 * @example 0o777 for an executable file.
	 */
	mode?: number;
}

export interface CreatedFiles {
	[i: string]: CreatedFileEntry | undefined;
}

export interface CreatedRequest {
	id: string;
	send: CreatedRequestSender;
}

export type CreatedRequestSender = (fetchers: SystemFetchers) => Promise<void>;

export type CreatedScript = CreatedScriptWithPhase | string;

export interface CreatedScriptWithPhase {
	commands: string[];
	phase: number;
}

export type Creation<Options extends object> = DirectCreation &
	IndirectCreation<Options>;

export interface DirectCreation {
	files: CreatedFiles;
	requests: CreatedRequest[];
	scripts: CreatedScript[];
}

export interface IndirectCreation<Options extends object> {
	// TODO: Figure out how to replace this with ... never? object?
	// Note it needs to pass tsc both in this repo and in create-typescript-app.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons: CreatedBlockAddons<any, Options>[];
}
