export interface CreatedDirectory {
	[i: string]: CreatedFileEntry | undefined;
}

export type CreatedFileEntry =
	| [string, CreatedFileOptions]
	| [string]
	| CreatedDirectory
	| false
	| string;

export interface CreatedFileOptions {
	/**
	 * File mode (permission and sticky bits) per chmod().
	 * @example 0o777 for an executable file.
	 */
	mode?: number;
}
