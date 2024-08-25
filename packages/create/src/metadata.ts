export interface CreatedMetadata {
	documentation?: DocumentationMetadata;
	files?: FilesMetadata[];
}

export type DocumentationMetadata = Record<string, string>;

export interface FilesMetadata {
	glob: string;
	type: FileType;
}

export enum FileType {
	Config,
	Documentation,
	Source,
	Test,
}
