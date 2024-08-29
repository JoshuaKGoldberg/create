import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "./context.js";
import { CreationFirstRound } from "./creations.js";
import { DocumentationBase } from "./documentation.js";

export interface PresetBase {
	documentation: DocumentationBase;
	repository?: string;
}

export type Preset<OptionsSchema extends object | undefined = undefined> =
	OptionsSchema extends object
		? PresetWithOptions<OptionsSchema>
		: PresetWithoutOptions;

export interface PresetWithoutOptions extends PresetBase {
	(context: CreationContextWithoutOptions): Promise<CreationFirstRound[]>;
}

export interface PresetWithOptions<
	OptionsSchema extends object | undefined = undefined,
> extends PresetBase {
	(
		context: CreationContextWithOptions<OptionsSchema>,
	): Promise<CreationFirstRound[]>;
	options: OptionsSchema;
}
