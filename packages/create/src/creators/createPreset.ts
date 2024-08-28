import { z } from "zod";

import { AnyOptionsSchema, InferredSchema } from "../options";
import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "../types/context";
import { CreationFirstRound } from "../types/creations";
import { Preset, PresetDocumentation } from "../types/presets";
import { PromiseOrSync } from "../utils";
import { isDefinitionWithOptions } from "./utils";

export type PresetDefinition<
	OptionsSchema extends AnyOptionsSchema | undefined = undefined,
> = OptionsSchema extends object
	? PresetDefinitionWithOptions<OptionsSchema>
	: PresetDefinitionWithoutOptions;

export interface PresetDefinitionBase {
	documentation: PresetDocumentation;
	repository?: string;
}

export interface PresetDefinitionWithoutOptions extends PresetDefinitionBase {
	produce: PresetProducer;
}

export interface PresetDefinitionWithOptions<
	OptionsSchema extends AnyOptionsSchema,
> extends PresetDefinitionBase {
	options: OptionsSchema;
	produce: PresetProducer<InferredSchema<OptionsSchema>>;
}

export type PresetProducer<Options extends object | undefined = undefined> =
	Options extends object
		? PresetProducerWithOptions<Options>
		: PresetProducerWithoutOptions;

export type PresetProducerWithoutOptions = (
	context: CreationContextWithoutOptions,
) => PromiseOrSync<CreationFirstRound[]>;

export type PresetProducerWithOptions<Options extends object> = (
	context: CreationContextWithOptions<Options>,
) => PromiseOrSync<CreationFirstRound[]>;

export function createPreset<
	OptionsSchema extends AnyOptionsSchema | undefined = undefined,
>(
	definition: PresetDefinition<OptionsSchema>,
): Preset<InferredSchema<OptionsSchema>> {
	if (!isDefinitionWithOptions(definition)) {
		const preset = (context: CreationContextWithoutOptions) => {
			return definition.produce(context);
		};

		preset.documentation = definition.documentation;
		preset.repository = definition.repository;

		return preset as Preset<InferredSchema<OptionsSchema>>;
	}

	const schema = z.object(definition.options);

	const preset = async (context: CreationContextWithOptions<OptionsSchema>) => {
		return await definition.produce({
			...context,
			options: schema.parse(context.options),
		});
	};

	preset.documentation = definition.documentation;
	preset.options = definition.options;
	preset.repository = definition.repository;

	return preset as Preset<InferredSchema<OptionsSchema>>;
}
