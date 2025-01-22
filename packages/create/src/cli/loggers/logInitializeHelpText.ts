import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { tryImportTemplate } from "../importers/tryImportTemplate.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { logHelpText } from "./logHelpText.js";
import { logSchemasHelpOptions } from "./logSchemasHelpOptions.js";

export interface InitializeHelpTextOptions {
	help: boolean | undefined;
	yes: boolean | undefined;
}

export async function logInitializeHelpText(
	from: string | undefined,
	{ help, yes }: InitializeHelpTextOptions,
) {
	if (!from) {
		if (help) {
			logHelpText("initialize");
		} else {
			prompts.log.message(
				[
					`Try it out with:`,
					`  ${chalk.green("npx create typescript-app@beta")}`,
				].join("\n"),
			);
		}

		return {
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		};
	}

	logHelpText("initialize", {
		descriptor: from,
		type: "template",
	});

	prompts.log.info(`Loading ${chalk.blue(from)} to display its options...`);

	const template = await tryImportTemplate(from, yes);
	if (template instanceof Error) {
		return {
			outro: chalk.red(CLIMessage.Exiting),
			status: CLIStatus.Error,
		};
	}

	logSchemasHelpOptions(from, template.options);

	return {
		outro: CLIMessage.Ok,
		status: CLIStatus.Success,
	};
}
