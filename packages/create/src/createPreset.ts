import { z } from "zod";

import { AnyOptionsSchema } from "./options";
import { Creation, ProvidedContext } from "./shared";
import { PromiseOrSync } from "./utils";

export interface PresetDocumentation {
	name: string;
}

export interface PresetDefinition<OptionsSchema extends AnyOptionsSchema> {
	documentation: PresetDocumentation;
	options: OptionsSchema;
	produce: PresetProducer<OptionsSchema>;
	repository?: string;
}

export type PresetProducer<OptionsSchema extends AnyOptionsSchema> = (
	context: ProvidedContext<OptionsSchema>,
) => PromiseOrSync<Creation[]>;

export function createPreset<OptionsSchema extends AnyOptionsSchema>(
	definition: PresetDefinition<OptionsSchema>,
) {
	const schema = z.object(definition.options);

	return async (context: ProvidedContext<OptionsSchema>) => {
		return await definition.produce({
			...context,
			options: schema.parse(context.options),
		});
	};
}
