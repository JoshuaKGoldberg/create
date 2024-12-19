import { tryImportFrom } from "./tryImportFrom.js";
import { isTemplate } from "./utils.js";

export async function tryImportTemplate(from: string) {
	const templateModule = await tryImportFrom(from);
	if (templateModule instanceof Error) {
		return templateModule;
	}

	if (!("default" in templateModule)) {
		return new Error(`${from} should have a default exported Template.`);
	}

	const template = templateModule.default;
	if (!isTemplate(template)) {
		return new Error(`${from}'s default export should be a Template.`);
	}

	return template;
}
