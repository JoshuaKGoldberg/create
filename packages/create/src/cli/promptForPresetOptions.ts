import readline from "node:readline/promises";
import * as z from "zod";

import { AnyShape, InferredObject } from "../options.js";
import { promptForSchema } from "./promptForSchema.js";

export async function promptForPresetOptions(
	schemas: z.ZodRawShape,
	existing: Record<string, unknown>,
) {
	const options: InferredObject<AnyShape> = {};

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	for (const [key, schema] of Object.entries(schemas)) {
		options[key] = existing[key] ?? (await promptForSchema(rl, key, schema));
	}

	rl.close();

	return options;
}
