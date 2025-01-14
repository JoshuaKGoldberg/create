import { CreatedDirectory } from "create-fs";

import { BlockWithAddons } from "./blocks.js";
import { SystemFetchers } from "./system.js";

export interface CreatedBlockAddons<
	Addons extends object = object,
	Options extends object = object,
> {
	addons: Addons;
	block: BlockWithAddons<Addons, Options>;
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
	files: CreatedDirectory;
	requests: CreatedRequest[];
	scripts: CreatedScript[];
}

export interface IndirectCreation<Options extends object> {
	// TODO: Figure out how to replace this with ... never? object?
	// Note it needs to pass tsc both in this repo and in create-typescript-app.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons: CreatedBlockAddons<any, Options>[];

	suggestions: string[];
}
