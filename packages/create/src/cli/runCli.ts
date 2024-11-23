import { producePreset } from "../api/producePreset.js";
import { parseArgsPreset } from "./parseArgvPreset.js";
import { parseZodArgs } from "./parseZodArgs.js";
import { promptForPreset } from "./promptForPreset.js";
import { promptForPresetOptions } from "./promptForPresetOptions.js";
import { isTemplate } from "./utils.js";

async function tryImport(source: string) {
	try {
		return (await import(source)) as object;
	} catch (error) {
		return error as Error;
	}
}

export async function runCli(templateLabel: string, ...args: string[]) {
	const templateSource = /^[./\\]/.test(templateLabel)
		? templateLabel
		: `create-${templateLabel}`;

	const templateModule = await tryImport(templateSource);

	if (templateModule instanceof Error) {
		throw new Error(`Could not import ${templateSource}.`, {
			cause: templateModule,
		});
	}

	if (!("default" in templateModule)) {
		throw new Error(
			`${templateSource} should have a default exported Template.`,
		);
	}

	const template = templateModule.default;
	if (!isTemplate(template)) {
		throw new Error(`${templateSource}'s default export should be a Template.`);
	}

	console.log(
		`Let us ✨ create ✨ a repository for the ${templateSource} Template!`,
	);

	const presetLabel = await promptForPreset(
		template.presets.map((preset) => preset.label),
		parseArgsPreset(args),
	);

	const presetListing = template.presets.find(
		(preset) => preset.label === presetLabel,
	);

	if (!presetListing) {
		throw new Error(
			`${templateSource} should have a Preset with label ${presetLabel}.`,
		);
	}

	const { preset } = presetListing;

	const parsedOptions = parseZodArgs(args, preset.base.options);

	const creation = await producePreset(preset, {
		options: parsedOptions,
		optionsAugment: async (options) =>
			promptForPresetOptions(preset.base.options, options),
	});

	console.log(creation.files);

	// await runCreation(creation, { /* ... */ });
}
