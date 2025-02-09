export type LazyOptionalOption<T> =
	| (() => Promise<T | undefined>)
	| (() => T | undefined)
	| T
	| undefined;

export type LazyOptionalOptions<Options> = {
	[K in keyof Options]: LazyOptionalOption<Options[K]>;
};
