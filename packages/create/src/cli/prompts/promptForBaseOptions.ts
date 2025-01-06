import * as prompts from "@clack/prompts";

import { AnyShape, InferredObject } from "../../options.js";
import { produceBase } from "../../producers/produceBase.js";
import { Base } from "../../types/bases.js";
import { SystemContext } from "../../types/system.js";
import { getSchemaDefaultValue } from "../../utils/getSchemaDefaultValue.js";
import { promptForSchema } from "./promptForSchema.js";

export interface PromptForBaseOptionsSettings<OptionsShape extends AnyShape> {
	existingOptions: Partial<InferredObject<OptionsShape>>;
	offline?: boolean;
	system: SystemContext;
}

export async function promptForBaseOptions<
	OptionsShape extends AnyShape = AnyShape,
>(
	base: Base<OptionsShape>,
	{
		existingOptions,
		offline,
		system,
	}: PromptForBaseOptionsSettings<OptionsShape>,
) {
	const { directory } = system;
	const options: InferredObject<AnyShape> = {
		directory,
		...existingOptions,
		...(await produceBase(base, {
			...system,
			offline,
			options: { ...existingOptions, directory },
		})),
	};

	for (const [key, schema] of Object.entries(base.options)) {
		const defaultValue = getSchemaDefaultValue(schema);
		if (
			(schema.isOptional() && defaultValue === undefined) ||
			options[key] !== undefined
		) {
			continue;
		}

		const prompted = await promptForSchema(key, schema, defaultValue);
		if (prompts.isCancel(prompted)) {
			return prompted;
		}

		options[key] = prompted;
	}

	return options;
}
