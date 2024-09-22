import { AnyShape } from "../options.js";
import { runPreset } from "../runners/runPreset.js";
import { Preset } from "../types/presets.js";
import { awaitCalledProperties } from "./awaitCalledProperties.js";
import { createRunningContext } from "./createRunningContext.js";
import { parseZodArgs } from "./parseZodArgs.js";
import { promptForPresetOptions } from "./promptForPresetOptions.js";

export async function runCli(args: string[]) {
	const presetPath = args[0];

	// Todo: switch to loading a template, which contains presets
	const presetModule = (await import(presetPath)) as object;
	if (!("default" in presetModule)) {
		throw new Error(`${presetPath} should have a default exported preset.`);
	}

	const preset = presetModule.default;
	if (!isPreset(preset)) {
		throw new Error(`${presetPath}'s default export should be a preset.`);
	}

	const name = preset.about?.name ?? "your preset";

	console.log(`Let's ✨ create ✨ a repository for you with ${name}!`);

	const context = createRunningContext();
	const parsedOptions = parseZodArgs(args, preset.schema.options);

	const producedOptions =
		preset.schema.produce &&
		(await awaitCalledProperties(
			preset.schema.produce({
				options: preset.schema.options,
				take: context.take,
			}),
		));

	const options = await promptForPresetOptions(preset.schema.options, {
		...parsedOptions,
		...producedOptions,
	});

	await runPreset(preset, options, context);
}

function isPreset(value: unknown): value is Preset<AnyShape> {
	return (
		!!value &&
		typeof value === "object" &&
		"blocks" in value &&
		Array.isArray(value.blocks) &&
		"schema" in value &&
		typeof value.schema === "object"
	);
}
