import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "./context";
import { CreationFirstRound } from "./creations";

export interface PresetBase {
	documentation: PresetDocumentation;
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

export interface PresetDocumentation {
	name: string;
}
