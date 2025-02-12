import * as prompts from "@clack/prompts";
import chalk from "chalk";
import { parseArgs } from "node:util";
import { z } from "zod";

import { packageData } from "../packageData.js";
import { createClackDisplay } from "./display/createClackDisplay.js";
import { findPositionalFrom } from "./findPositionalFrom.js";
import { runModeInitialize } from "./initialize/runModeInitialize.js";
import { logOutro } from "./loggers/logOutro.js";
import { runModeMigrate } from "./migrate/runModeMigrate.js";
import { readProductionSettings } from "./readProductionSettings.js";
import { CLIStatus } from "./status.js";

const valuesSchema = z.object({
	directory: z.string().optional(),
	from: z.string().optional(),
	help: z.boolean().optional(),
	mode: z.union([z.literal("initialize"), z.literal("migrate")]).optional(),
	offline: z.boolean().optional(),
	owner: z.string().optional(),
	preset: z.string().optional(),
	repository: z.string().optional(),
	yes: z.boolean().optional(),
});

export async function runCli(args: string[]) {
	const { positionals, values } = parseArgs({
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
			offline: {
				type: "boolean",
			},
			owner: {
				type: "string",
			},
			preset: {
				type: "string",
			},
			repository: {
				type: "string",
			},
			version: {
				type: "boolean",
			},
			yes: {
				type: "boolean",
			},
		},
		strict: false,
	});

	if (values.version) {
		console.log(packageData.version);
		return CLIStatus.Success;
	}

	prompts.intro(
		[
			chalk.greenBright(`✨ `),
			chalk.bgGreenBright.black(`create`),
			chalk.greenBright(` ✨`),
		].join(""),
	);

	prompts.log.message(
		[
			`Welcome to ${chalk.bgGreenBright.black("create")}: a delightful repository templating engine.`,
			"",
			"Learn more about create on:",
			`  ${chalk.green("https://")}${chalk.green.bold("create.bingo")}`,
		].join("\n"),
	);

	const validatedValues = valuesSchema.parse(values);
	const productionSettings = await readProductionSettings(validatedValues);
	if (productionSettings instanceof Error) {
		logOutro(chalk.red(productionSettings.message));
		return CLIStatus.Error;
	}

	const display = createClackDisplay();
	const sharedSettings = {
		...validatedValues,
		args,
		display,
		from: validatedValues.from ?? findPositionalFrom(positionals),
	};

	const { outro, status, suggestions } =
		productionSettings.mode === "initialize"
			? await runModeInitialize(sharedSettings)
			: await runModeMigrate({
					...sharedSettings,
					configFile: productionSettings.configFile,
				});

	logOutro(
		outro ??
			chalk.yellow("Operation cancelled. Exiting - maybe another time? 👋"),
		{ items: display.dumpItems(), suggestions },
	);

	return status;
}
