// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { execa } from "execa";

import { CreatedMetadata } from "./metadata";
import { AnyOptionsSchema, InferredSchema } from "./options";
import { PromiseOrSync } from "./utils";

// Components

export type BlockProducer<BlockOptionsSchema extends AnyOptionsSchema> = (
	context: ContextWithOptions<BlockOptionsSchema>,
) => PromiseOrSync<CreationFirstRound>;

export interface AddonDefinition<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
> {
	options: AddonOptionsSchema;
	produce: AddonProducer<AddonOptionsSchema, BlockOptionsSchema>;
}

export type AddonProducer<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
> = (
	context: ContextWithOptions<AddonOptionsSchema>,
) => PromiseOrSync<InferredSchema<BlockOptionsSchema>>;

export interface Block<BlockOptionsSchema extends AnyOptionsSchema>
	extends BlockProducer<BlockOptionsSchema> {
	createAddon: <AddonOptionsSchema extends AnyOptionsSchema>(
		addonDefinition: AddonDefinition<AddonOptionsSchema, BlockOptionsSchema>,
	) => Addon<AddonOptionsSchema, BlockOptionsSchema>;
}

export type Addon<
	AddonOptionsSchema extends AnyOptionsSchema,
	BlockOptionsSchema extends AnyOptionsSchema,
> = (
	context: ContextWithOptions<AddonOptionsSchema>,
) => PromiseOrSync<InferredSchema<BlockOptionsSchema>>;

export type Input<OptionsSchema extends AnyOptionsSchema, Result> = (
	context: ContextWithOptions<OptionsSchema>,
) => Result;

export type TakeInput = <Options extends AnyOptionsSchema, Result>(
	input: Input<Options, Result>,
	options: InferredSchema<Options>,
) => Result;

export interface Preset<PresetOptionsSchema extends AnyOptionsSchema> {
	(
		context: ContextWithOptions<PresetOptionsSchema>,
	): Promise<CreationFirstRound[]>;

	documentation: PresetDocumentation;
	options: PresetOptionsSchema;
	repository?: string;
}

export interface PresetDocumentation {
	name: string;
}

// Context

export interface CreationContext {
	fetcher: typeof fetch;
	fs: ContextFS;
	runner: typeof execa;
	take: TakeInput;
}

export interface ContextFS {
	readFile: FSReadFile;
	writeFile: FSWriteFile;
}

export type FSReadFile = (filePath: string) => Promise<string>;

export type FSWriteFile = (filePath: string, contents: string) => Promise<void>;

export interface ContextWithOptions<OptionsSchema extends AnyOptionsSchema>
	extends CreationContext {
	options: InferredSchema<OptionsSchema>;
}

// Creations

export interface Creation {
	commands?: string[];
	files?: CreatedFiles;
	metadata?: CreatedMetadata;
	packages?: CreatedPackages;
	scripts?: CreatedScripts;
}

export type CreationFirstRound = {
	[K in keyof Creation]: ((creation: Creation) => Creation[K]) | Creation[K];
};

export interface CreatedFiles {
	[i: string]: CreatedFileEntry | undefined;
}

export type CreatedFileEntry = CreatedFiles | false | string;

export interface CreatedPackages {
	dependencies?: CreatedPackagesWithVersions;
	devDependencies?: CreatedPackagesWithVersions;
	peerDependencies?: CreatedPackagesWithVersions;
}

export interface CreatedPackagesWithVersions {
	[i: string]: string;
}

export interface CreatedScripts {
	[i: string]: string;
}
