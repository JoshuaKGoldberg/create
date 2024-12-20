import * as prompts from "@clack/prompts";
import fs from "node:fs/promises";

import { Template } from "../../types/templates.js";
import { validateBlankDirectory } from "./validators.js";

export async function promptForInitializationDirectory(
	requested: string | undefined,
	template: Template,
) {
	if (requested) {
		if (validateBlankDirectory(requested)) {
			prompts.log.warn(`The '${requested}' directory already exists.`);
		} else {
			return requested;
		}
	}

	const directory = await prompts.text({
		initialValue:
			template.about?.name &&
			`my-${template.about.name.toLowerCase().replaceAll(" ", "-")}`,
		message: "What directory would you like to create the repository in?",
		validate: validateBlankDirectory,
	});

	if (!prompts.isCancel(directory)) {
		await fs.mkdir(directory, { recursive: true });
	}

	return directory;
}
