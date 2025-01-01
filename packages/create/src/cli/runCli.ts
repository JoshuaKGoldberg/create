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

const valuesSchema = z.object({
	directory: z.string().optional(),
	from: z.string().optional(),
	mode: z.union([z.literal("initialize"), z.literal("migrate")]).optional(),
	owner: z.string().optional(),
	preset: z.string().optional(),
	repository: z.string().optional(),
});

export async function runCli(args: string[]) {
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
		},
		strict: false,
	});

	if (values.help) {
		logHelpText(console);
		return CLIStatus.Success;
	}

	if (values.version) {
		console.log(packageData.version);
		return CLIStatus.Success;
	}

	prompts.intro(
		[
			chalk.greenBright(`✨ `),
			chalk.bgGreenBright.black(`create`),
			chalk.greenBright(`@${packageData.version} ✨`),
		].join(""),
	);

	prompts.log.message(
		[
			`Welcome to ${chalk.bgGreenBright.black("create")}: a composable, testable, type-safe templating engine.`,
			"",
			"Learn more about create on:",
			`  ${chalk.green("https://create.bingo")}`,
		].join("\n"),
	);

	const validatedValues = valuesSchema.parse(values);
	const productionSettings = await readProductionSettings(validatedValues);
	if (productionSettings instanceof Error) {
		logOutro(chalk.red(productionSettings.message));
		return CLIStatus.Error;
	}

	if (productionSettings.mode === "initialize" && args.length === 0) {
		prompts.log.message(
			[
				`Try it out with:`,
				`  ${chalk.green("npx create typescript-app")}`,
			].join("\n"),
		);
		logOutro("Cheers! 💝");
		return CLIStatus.Success;
	}

	const { outro, status, suggestions } =
		productionSettings.mode === "initialize"
			? await runModeInitialize({ ...validatedValues, args })
			: await runModeMigrate({
					...validatedValues,
					args,
					configFile: productionSettings.configFile,
				});

	logOutro(
		outro ??
			chalk.yellow("Operation cancelled. Exiting - maybe another time? 👋"),
		suggestions,
	);

	return status;
}
