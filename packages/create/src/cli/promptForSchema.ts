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
	let value: unknown;

	while (value === undefined || value === "") {
		switch (def.typeName) {
			case z.ZodFirstPartyTypeKind.ZodBoolean: {
				value = await promptForBoolean(rl, `Enter y or n for ${key}.\n`);
				break;
			}

			case z.ZodFirstPartyTypeKind.ZodNumber:
				value = schema.parse(
					Number(await rl.question(`Enter a value for ${key}.\n`)),
				) as unknown;
				break;

			// TODO: Handle numeric literals, unions, ...

			default:
				value = schema.parse(
					await rl.question(`Enter a value for ${key}.\n`),
				) as unknown;
				break;
		}
	}

	return value;
}
