import * as prompts from "@clack/prompts";
import chalk from "chalk";
import { parseArgs } from "node:util";
import { z } from "zod";

import { packageData } from "../packageData.js";
import { runModeInitialize } from "./initialize/runModeInitialize.js";
import { logHelpText } from "./loggers/logHelpText.js";
import { logOutro } from "./loggers/logOutro.js";
import { runModeMigrate } from "./migrate/runModeMigrate.js";
import { readProductionSettings } from "./readProductionSettings.js";
import { CLIStatus } from "./status.js";
import { Logger } from "./types.js";

const valuesSchema = z.object({
	directory: z.string().optional(),
	from: z.string().optional(),
	mode: z.union([z.literal("initialize"), z.literal("migrate")]).optional(),
	preset: z.string().optional(),
});

export async function runCli(args: string[], logger: Logger) {
	const { values } = parseArgs({
		args,
		options: {
			directory: {
				type: "string",
			},
			from: {
				type: "string",
			},
			help: {
				type: "boolean",
			},
			mode: {
				type: "string",
			},
			preset: {
				type: "string",
			},
			version: {
				type: "boolean",
			},
		},
		strict: false,
	});

	if (values.help) {
		logHelpText(logger);
		return CLIStatus.Success;
	}

	if (values.version) {
		return CLIStatus.Success;
	}

	prompts.intro(
		[
			chalk.greenBright(`✨ `),
			chalk.bgGreenBright.black(`create`),
			chalk.greenBright(`@${packageData.version} ✨`),
		].join(""),
	);

	const validatedValues = valuesSchema.parse(values);
	const productionSettings = await readProductionSettings(validatedValues);

	const { outro, status, suggestions } =
		productionSettings.mode === "initialize"
			? await runModeInitialize({ ...validatedValues, args })
			: await runModeMigrate();

	logOutro(
		outro ?? chalk.red("Operation cancelled. Exiting - maybe another time? 👋"),
		suggestions,
	);

	return status;
}
