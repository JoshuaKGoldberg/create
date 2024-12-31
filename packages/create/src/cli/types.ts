import { SystemContext } from "../types/system.js";
import { CLIStatus } from "./status.js";

export type Logger = Pick<Console, "log">;

export type ModeResults =
	| ModeResultsCancelled
	| ModeResultsError
	| ModeResultsSuccess;

export interface ModeResultsCancelled {
	status: CLIStatus.Cancelled;
}

export interface ModeResultsError {
	outro: string;
	status: CLIStatus.Error;
}

export interface ModeResultsSuccess {
	directory: string;
	from?: string;
	options: object;
	outro: string;
	status: CLIStatus.Success;
	suggestions?: string[];
	system: SystemContext;
}

export type ProductionSettings =
	| ProductionSettingsInitialize
	| ProductionSettingsMigrate;

export interface ProductionSettingsInitialize {
	mode: "initialize";
}

export interface ProductionSettingsMigrate {
	configFile?: string;
	mode: "migrate";
}
