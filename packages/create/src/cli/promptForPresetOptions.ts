import readline from "node:readline/promises";
import * as z from "zod";

import { AnyOptionsSchema, InferredSchema } from "../options";
import { promptForSchema } from "./promptForSchema";

export async function promptForPresetOptions(schemas: z.ZodRawShape) {
	const options: InferredSchema<AnyOptionsSchema> = {};

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	for (const [key, schema] of Object.entries(schemas)) {
		options[key] = await promptForSchema(rl, key, schema);
	}

	rl.close();

	return options;
}
