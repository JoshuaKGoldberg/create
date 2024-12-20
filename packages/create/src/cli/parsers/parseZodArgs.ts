// TODO: Split out into standalone package
/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// TODO: Add fancy TS types to convert from Zod to parseArgs

import { parseArgs, ParseArgsConfig } from "util";
import {
	ZodBooleanDef,
	ZodFirstPartyTypeKind,
	ZodLiteralDef,
	ZodStringDef,
	ZodTypeAny,
} from "zod";

import { AnyShape, InferredObject } from "../../options.js";

type ParseArgsOptionsConfig = NonNullable<ParseArgsConfig["options"]>;

type ParseArgsOptionsType = ParseArgsOptionsConfig[string]["type"];

export function parseZodArgs<OptionsShape extends AnyShape>(
	args: string[],
	options: OptionsShape,
): InferredObject<OptionsShape> {
	const argsOptions: ParseArgsConfig["options"] = {};

	for (const [key, value] of Object.entries(options)) {
		const argsOption = zodValueToArgsOption(value);

		if (argsOption) {
			argsOptions[key] = argsOption;
		}
	}

	return parseArgs({
		args,
		options: argsOptions,
		strict: false,
	}).values as InferredObject<OptionsShape>;
}

function zodValueToArgsOption(
	zodValue: ZodTypeAny,
): ParseArgsOptionsConfig[string] | undefined {
	switch (zodValue._def.typeName) {
		// case "ZodArray":
		// 	return {
		// 		multiple: true,
		// 		type: zodValueTypeToArgsOptionType(zodValue._def),
		// 	};

		case "ZodBoolean":
		case "ZodLiteral":
		case "ZodString":
			return {
				type: zodValueTypeToArgsOptionType(zodValue._def),
			};

		case "ZodOptional":
			return zodValueToArgsOption(zodValue._def.innerType);

		case "ZodUnion":
			return zodValueToArgsOption(zodValue._def.options[0]);
	}

	// throw new Error(`Unknown zod value type: ${zodValue._def.typeName}`);
	return undefined;
}

function zodValueTypeToArgsOptionType(
	def: ZodBooleanDef | ZodLiteralDef | ZodStringDef,
): ParseArgsOptionsType {
	switch (def.typeName) {
		case ZodFirstPartyTypeKind.ZodBoolean:
			return "boolean";

		case ZodFirstPartyTypeKind.ZodLiteral: {
			const typeofValue = typeof def.value;
			if (typeofValue === "boolean" || typeofValue === "string") {
				return typeofValue;
			}
			break;
		}

		case ZodFirstPartyTypeKind.ZodString:
			return "string";
	}

	throw new Error(`Unknown zod value type: ${def.typeName}`);
}
