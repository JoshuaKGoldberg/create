import { runPreset } from "../runners/runPreset.js";
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

	await runPreset(preset, {
		// TODO: allow changing directory
		// https://github.com/JoshuaKGoldberg/create/issues/26 (or a follow-up)
		directory: ".",

		options: parsedOptions,

		// TODO: why is options `any` without the type annotation?
		optionsAugment: async (options: typeof parsedOptions) =>
			promptForPresetOptions(preset.base.options, options),
	});
}
