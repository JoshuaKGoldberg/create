// TODO: Split out into standalone package
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// TODO: Add fancy TS types to convert from Zod to parseArgs

import { parseArgs, ParseArgsConfig } from "util";
import { ZodTypeAny } from "zod";

import { AnyShape, InferredObject } from "../options.js";

export function parseZodArgs<OptionsShape extends AnyShape>(
	args: string[],
	options: OptionsShape,
): InferredObject<OptionsShape> {
	const argsOptions: ParseArgsConfig["options"] = {};

	for (const [key, value] of Object.entries(options)) {
		argsOptions[key] = zodValueToArgsOption(value);
	}

	return parseArgs({
		args,
		options: argsOptions,
	}).values as InferredObject<OptionsShape>;
}

type ParseArgsOptionsConfig = NonNullable<ParseArgsConfig["options"]>;
type ParseArgsOptionsType = ParseArgsOptionsConfig[string]["type"];

function zodValueToArgsOption(
	zodValue: ZodTypeAny,
): ParseArgsOptionsConfig[string] {
	switch (zodValue._def.typeName) {
		case "ZodArray":
			return {
				multiple: true,
				type: zodValueTypeToArgsOptionType(zodValue._def.type.typeName),
			};

		case "ZodBoolean":
		case "ZodString":
			return {
				type: zodValueTypeToArgsOptionType(zodValue._def.typeName),
			};
	}

	throw new Error(`Unknown zod value type: ${zodValue._def.typeName}`);
}

function zodValueTypeToArgsOptionType(
	zodValueType: string,
): ParseArgsOptionsType {
	switch (zodValueType) {
		case "ZodBoolean":
			return "boolean";

		case "ZodString":
			return "string";
	}

	throw new Error(`Unknown zod value type: ${zodValueType}`);
}
