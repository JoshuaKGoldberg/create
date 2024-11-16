import readline from "node:readline/promises";
import * as z from "zod";

import { AnyShape, InferredObject } from "../options.js";
import { promptForSchema } from "./promptForSchema.js";

export async function promptForPresetOptions(
	bases: z.ZodRawShape,
	existing: Record<string, unknown>,
) {
	const options: InferredObject<AnyShape> = {};

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	for (const [key, base] of Object.entries(bases)) {
		if (!base.isOptional()) {
			options[key] = existing[key] ?? (await promptForSchema(rl, key, base));
		}
	}

	rl.close();

	return options;
}
