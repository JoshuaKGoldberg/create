import { producePreset } from "../api/producePreset.js";
import { runCreation } from "../runners/runCreation.js";
import { createNativeSystem } from "../system/createNativeSystem.js";
import { createTakeInput } from "../system/createTakeInput.js";
import { parseZodArgs } from "./parseZodArgs.js";
import { promptForPresetOptions } from "./promptForPresetOptions.js";
import { isPreset, isTemplate } from "./utils.js";

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

	const nativeSystem = createNativeSystem();
	const system = { ...nativeSystem, take: createTakeInput(nativeSystem) };
	const parsedOptions = parseZodArgs(args, preset.schema.options);

	const creation = await producePreset(preset, {
		options: parsedOptions,
		optionsAugment: async (options) =>
			promptForPresetOptions(preset.schema.options, options),
		system,
	});

	await runCreation(creation, system);
}
