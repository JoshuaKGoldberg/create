import { AnyOptionsSchema } from "../options.js";
import { runPreset } from "../runners/runPreset.js";
import { Preset } from "../types/presets.js";
import { promptForPresetOptions } from "./promptForPresetOptions.js";
import { setupContext } from "./setupContext.js";

export async function runCli(args: string[]) {
	const presetPath = args[0];

	const presetModule = (await import(presetPath)) as object;
	if (!("default" in presetModule)) {
		throw new Error(`${presetPath} should have a default exported preset.`);
	}

	const preset = presetModule.default;
	if (!isPreset(preset)) {
		throw new Error(`${presetPath}'s default export should be a preset.`);
	}

	console.log(
		`Let's ✨ create ✨ a repository for you based on ${preset.documentation.name}!`,
	);

	const options = await promptForPresetOptions(preset.options);
	const context = setupContext();

	await runPreset(preset, options, context);
}

function isPreset(value: unknown): value is Preset<AnyOptionsSchema> {
	return (
		typeof value === "function" &&
		"documentation" in value &&
		"repository" in value
	);
}
