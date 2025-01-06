import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { tryImportTemplate } from "../importers/tryImportTemplate.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { logHelpText } from "./logHelpText.js";
import { logSchemasHelpOptions } from "./logSchemasHelpOptions.js";

export async function logInitializeHelpText(
	from: string | undefined,
	help: boolean | undefined,
) {
	if (!from) {
		if (help) {
			logHelpText("initialize");
		} else {
			prompts.log.message(
				[
					`Try it out with:`,
					`  ${chalk.green("npx create typescript-app")}`,
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

	const spinner = prompts.spinner();
	spinner.start(`Loading ${chalk.blue(from)}`);

	const template = await tryImportTemplate(from);
	if (template instanceof Error) {
		spinner.stop(
			`Could not load ${chalk.blue(from)}: ${chalk.red(template.message)}.`,
			1,
		);
		return {
			outro: chalk.red(CLIMessage.Exiting),
			status: CLIStatus.Error,
		};
	}

	spinner.stop(`Loaded ${chalk.blue(from)}`);

	logSchemasHelpOptions(from, template.options);

	return {
		outro: CLIMessage.Ok,
		status: CLIStatus.Success,
	};
}
