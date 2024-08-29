import readline from "node:readline/promises";
import * as z from "zod";

import { promptForBoolean } from "./promptForBoolean.js";

type ZodDef = z.ZodBooleanDef | z.ZodNumberDef | z.ZodStringDef;

export async function promptForSchema(
	rl: readline.Interface,
	key: string,
	schema: z.ZodTypeAny,
) {
	const def = schema._def as ZodDef;

	switch (def.typeName) {
		case z.ZodFirstPartyTypeKind.ZodBoolean: {
			return await promptForBoolean(rl, `Enter y or n for ${key}.\n`);
		}

		case z.ZodFirstPartyTypeKind.ZodNumber:
			return schema.parse(
				Number(await rl.question(`Enter a value for ${key}.\n`)),
			) as unknown;

		case z.ZodFirstPartyTypeKind.ZodString:
			return schema.parse(
				await rl.question(`Enter a value for ${key}.\n`),
			) as unknown;

		default:
			throw new Error(`Unknown schema for ${key}: ${(def as ZodDef).typeName}`);
	}
}
