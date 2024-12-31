import * as prompts from "@clack/prompts";
import chalk from "chalk";
import { parseArgs } from "node:util";
import { z } from "zod";

import { packageData } from "../packageData.js";
import { createClackDisplay } from "./display/createClackDisplay.js";
import { runModeInitialize } from "./initialize/runModeInitialize.js";
import { logHelpText } from "./loggers/logHelpText.js";
import { logOutro } from "./loggers/logOutro.js";
import { runModeMigrate } from "./migrate/runModeMigrate.js";
import { readProductionSettings } from "./readProductionSettings.js";
import { CLIStatus } from "./status.js";
import { Logger } from "./types.js";
import { startWatchMode } from "./watch/startWatchMode.js";

const valuesSchema = z.object({
	directory: z.string().optional(),
	from: z.string().optional(),
	mode: z.union([z.literal("initialize"), z.literal("migrate")]).optional(),
	owner: z.string().optional(),
	preset: z.string().optional(),
	repository: z.string().optional(),
	watch: z.boolean().optional(),
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
			watch: {
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
		logger.log(packageData.version);
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
	if (productionSettings instanceof Error) {
		logOutro(chalk.red(productionSettings.message));
		return CLIStatus.Error;
	}

	const display = createClackDisplay();
	const modeResults =
		productionSettings.mode === "initialize"
			? await runModeInitialize({ ...validatedValues, args, display })
			: await runModeMigrate({
					...validatedValues,
					args,
					configFile: productionSettings.configFile,
					display,
				});

	if (modeResults.status !== CLIStatus.Success) {
		logOutro(
			modeResults.status === CLIStatus.Error
				? modeResults.outro
				: chalk.yellow("Operation cancelled. Exiting - maybe another time? 👋"),
		);
		return modeResults.status;
	}

	if (!validatedValues.watch) {
		logOutro(modeResults.outro, modeResults.suggestions);
		return modeResults.status;
	}

	const watchResults = await startWatchMode({
		...validatedValues,
		...modeResults,
		...productionSettings,
		display,
	});

	logOutro(watchResults.outro);

	return watchResults.status;
}
