export interface ModeResults {
	outro?: string;
	status: number;
	suggestions?: string[];
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
