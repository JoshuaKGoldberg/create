import * as prompts from "@clack/prompts";

import { AnyShape, InferredObject } from "../../options.js";
import { produceBase } from "../../producers/produceBase.js";
import { Base } from "../../types/bases.js";
import { SystemContext } from "../../types/system.js";
import { promptForSchema } from "./promptForSchema.js";

export interface PromptForBaseOptionsSettings {
	existingOptions: Partial<InferredObject<AnyShape>>;
	offline?: boolean;
	system: SystemContext;
}

export async function promptForBaseOptions(
	base: Base,
	{ existingOptions, offline, system }: PromptForBaseOptionsSettings,
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
