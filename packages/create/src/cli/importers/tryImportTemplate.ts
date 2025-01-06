import * as prompts from "@clack/prompts";
import chalk from "chalk";

import { isTemplate } from "../../predicates/isTemplate.js";
import { tryImportWithPredicate } from "../tryImportWithPredicate.js";
import { tryImportAndInstallIfNecessary } from "./tryImportAndInstallIfNecessary.js";

export async function tryImportTemplate(from: string) {
	const spinner = prompts.spinner();
	spinner.start(`Loading ${chalk.blue(from)}`);

	const template = await tryImportWithPredicate(
		tryImportAndInstallIfNecessary,
		from,
		isTemplate,
		"Template",
	);

	if (template instanceof Error) {
		spinner.stop(
			`Could not load ${chalk.blue(from)}: ${chalk.red(template.message)}`,
			1,
		);
		return template;
	}

	spinner.stop(`Loaded ${chalk.blue(from)}`);

	return template;
}
