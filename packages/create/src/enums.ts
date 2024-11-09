export enum BlockPhase {
	Default = 0,
	Install,
	Source,
	Test,
	Build,
	Format,
	Lint,
	Package,
	Documentation,
	Git,
	Editor,
	CI,
}

export enum MetadataFileType {
	Built,
	Config,
	Documentation,
	Ignored,
	License,
	Snapshot,
	Source,
	Test,
}
