import { z } from "zod";

import { AnyOptionsSchema } from "../options";
import {
	ContextWithOptions,
	CreationFirstRound,
	Preset,
	PresetDocumentation,
} from "../shared";
import { PromiseOrSync } from "../utils";

export interface PresetDefinition<OptionsSchema extends AnyOptionsSchema> {
	documentation: PresetDocumentation;
	options: OptionsSchema;
	produce: PresetProducer<OptionsSchema>;
	repository?: string;
}

export type PresetProducer<OptionsSchema extends AnyOptionsSchema> = (
	context: ContextWithOptions<OptionsSchema>,
) => PromiseOrSync<CreationFirstRound[]>;

export function createPreset<OptionsSchema extends AnyOptionsSchema>(
	definition: PresetDefinition<OptionsSchema>,
): Preset<OptionsSchema> {
	const schema = z.object(definition.options);

	const preset = async (context: ContextWithOptions<OptionsSchema>) => {
		return await definition.produce({
			...context,
			options: schema.parse(context.options),
		});
	};

	preset.documentation = definition.documentation;
	preset.options = definition.options;
	preset.repository = definition.repository;
	preset.isPreset = true;

	return preset;
}

export function isPreset(value: unknown): value is Preset<AnyOptionsSchema> {
	return typeof value === "function" && "isPreset" in value && !!value.isPreset;
}
