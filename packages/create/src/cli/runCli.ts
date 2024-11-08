// TODO: redo templates to be presets
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import { producePreset } from "../api/producePreset.js";
import { runCreation } from "../runners/runCreation.js";
import { createNativeSystems } from "../system/createNativeSystems.js";
import { parseZodArgs } from "./parseZodArgs.js";
import { promptForPresetOptions } from "./promptForPresetOptions.js";
import { isPreset } from "./utils.js";

declare const isTemplate: (value: unknown) => value is any;

Error.stackTraceLimit = Infinity;

export async function runCli(argv: string[]) {
	const [, , templatePath, ...args] = argv;

	const templateModule = (await import(templatePath)) as object;
	if (!("default" in templateModule)) {
		throw new Error(`${templatePath} should have a default exported template.`);
	}

	const template = templateModule.default;
	if (!isTemplate(template)) {
		throw new Error(`${templatePath}'s default export should be a template.`);
	}

	const presetName = "everything";
	const preset = template.presets[presetName];

	if (!isPreset(preset)) {
		throw new Error(
			`${templatePath}'s preset ${presetName} should be a template.`,
		);
	}

	const templateDisplay = template.about?.name ?? "your preset";
	const presetDisplay = preset.about?.name ?? presetName;

	console.log(
		`Let's ✨ create ✨ a repository for you with the ${templateDisplay} template's ${presetDisplay} preset!`,
	);

	const { system, take } = createNativeSystems();
	const parsedOptions = parseZodArgs(args, preset.schema.options);

	const creation = await producePreset(preset, {
		options: parsedOptions,
		optionsAugment: async (options) =>
			promptForPresetOptions(preset.schema.options, options),
		...system,
	});

	await runCreation(creation, { ...system, take });
}
