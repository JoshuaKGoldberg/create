export type Logger = Pick<Console, "log">;

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
