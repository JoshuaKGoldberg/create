import * as prompts from "@clack/prompts";

import { AnyShape, InferredObject } from "../../options.js";
import { produceBase } from "../../producers/produceBase.js";
import { Base } from "../../types/bases.js";
import { SystemContext } from "../../types/system.js";
import { promptForSchema } from "./promptForSchema.js";

export interface PromptForPresetOptionsSettings {
	base: Base;
	existingOptions: Partial<InferredObject<AnyShape>>;
	system: SystemContext;
}

export async function promptForPresetOptions({
	base,
	existingOptions,
	system,
}: PromptForPresetOptionsSettings) {
	const { directory } = system;
	const options: InferredObject<AnyShape> = {
		directory,
		...existingOptions,
		...(await produceBase(base, {
			...system,
			options: { ...existingOptions, directory },
		})),
	};

	for (const [key, schema] of Object.entries(base.options)) {
		if (schema.isOptional() || options[key] !== undefined) {
			continue;
		}

		const prompted = await promptForSchema(key, schema);
		if (prompts.isCancel(prompted)) {
			return prompted;
		}

		options[key] = prompted;
	}

	return options;
}
