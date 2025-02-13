import * as prompts from "@clack/prompts";

import { AnyShape, InferredObject } from "../../options.js";
import { SystemContext } from "../../types/system.js";
import { Template } from "../../types/templates.js";
import { getSchemaDefaultValue } from "../../utils/getSchemaDefaultValue.js";
import { produceOptionsDefaults } from "./produceOptionsDefaults.js";
import { promptForSchema } from "./promptForSchema.js";

export type PromptedOptions<Options extends object> =
	| PromptedOptionsCancelled<Options>
	| PromptedOptionsProduced<Options>;

export interface PromptedOptionsCancelled<Options extends object> {
	cancelled: true;
	prompted: Partial<Options>;
}

export interface PromptedOptionsProduced<Options extends object> {
	cancelled: false;
	completed: Options;
	prompted: Partial<Options>;
}

export interface PromptForOptionsSettings<OptionsShape extends AnyShape> {
	existing: Partial<InferredObject<OptionsShape>>;
	offline?: boolean;
	system: SystemContext;
}

export async function promptForOptions<
	OptionsShape extends AnyShape = AnyShape,
>(
	template: Template<OptionsShape>,
	{ existing, offline, system }: PromptForOptionsSettings<OptionsShape>,
): Promise<PromptedOptions<InferredObject<OptionsShape>>> {
	type Options = InferredObject<OptionsShape>;

	const { directory } = system;
	const completed: InferredObject<AnyShape> = {
		directory,
		...existing,
		...(await produceOptionsDefaults(template.prepare, {
			...system,
			existing: { ...existing, directory },
			offline,
		})),
	};
	const prompted: Partial<Options> = {};

	for (const [key, schema] of Object.entries(template.options)) {
		const defaultValue = getSchemaDefaultValue(schema);
		if (
			(schema.isOptional() && defaultValue === undefined) ||
			completed[key] !== undefined
		) {
			continue;
		}

		const produced = await promptForSchema(key, schema, defaultValue);
		if (prompts.isCancel(produced)) {
			return { cancelled: true, prompted };
		}

		(prompted as typeof completed)[key] = produced;
	}

	return {
		cancelled: false,
		completed: {
			...completed,
			...prompted,
		} as Options,
		prompted,
	};
}
