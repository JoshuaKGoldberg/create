import * as prompts from "@clack/prompts";

import { AnyShape, InferredObject } from "../../options.js";
import { produceBase } from "../../producers/produceBase.js";
import { Base } from "../../types/bases.js";
import { SystemContext } from "../../types/system.js";
import { getSchemaDefaultValue } from "../../utils/getSchemaDefaultValue.js";
import { promptForSchema } from "./promptForSchema.js";

export type PromptedBaseOptions<Options extends object> =
	| PromptedBaseOptionsCancelled<Options>
	| PromptedBaseOptionsProduced<Options>;

export interface PromptedBaseOptionsCancelled<Options extends object> {
	cancelled: true;
	prompted: Partial<Options>;
}

export interface PromptedBaseOptionsProduced<Options extends object> {
	cancelled: false;
	completed: Options;
	prompted: Partial<Options>;
}

export interface PromptForBaseOptionsSettings<OptionsShape extends AnyShape> {
	existing: Partial<InferredObject<OptionsShape>>;
	offline?: boolean;
	system: SystemContext;
}

export async function promptForBaseOptions<
	OptionsShape extends AnyShape = AnyShape,
>(
	base: Base<OptionsShape>,
	{ existing, offline, system }: PromptForBaseOptionsSettings<OptionsShape>,
): Promise<PromptedBaseOptions<InferredObject<OptionsShape>>> {
	type Options = InferredObject<OptionsShape>;

	const { directory } = system;
	const completed: InferredObject<AnyShape> = {
		directory,
		...existing,
		...(await produceBase(base, {
			...system,
			offline,
			options: { ...existing, directory },
		})),
	};
	const prompted: Partial<Options> = {};

	for (const [key, schema] of Object.entries(base.options)) {
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
