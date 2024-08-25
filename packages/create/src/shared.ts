import type * as prettier from "prettier";

import { Input } from "./createInput";
import { CreatedMetadata } from "./metadata";
import { AnyOptionsSchema, InferredSchema } from "./options";
import { PromiseOrSync } from "./utils";

export interface Creation {
	commands?: string[];
	files?: CreatedFiles;
	metadata?: CreatedMetadata;
	migrations?: CreatedMigration[];
	packages?: CreatedPackages;
	scripts?: CreatedScripts;
}

export interface CreatedFiles {
	[i: string]: CreatedFiles | CreatedFileWithMetadata | false | string;
}

export type CreatedFileWithMetadata = [string, CreatedFileMetadata];

export interface CreatedFileMetadata {
	parser?: prettier.BuiltInParserName;
}

export interface CreatedMigration {
	name: string;
	produce: () => PromiseOrSync<Creation>;
}

export interface CreatedPackages {
	dependencies?: string[];
	devDependencies?: string[];
	peerDependencies?: string[];
}

export type CreatedScripts = Record<string, string>;

export type TakeInput = <Options extends AnyOptionsSchema, Result>(
	input: Input<Options, Result>,
	options: InferredSchema<Options>,
) => Result;

export interface ProvidedContext<OptionsSchema extends AnyOptionsSchema> {
	options: InferredSchema<OptionsSchema>;
	take: TakeInput;
}
