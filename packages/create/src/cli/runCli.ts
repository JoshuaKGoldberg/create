import { AnyOptionsSchema } from "../options";
import { runPreset } from "../runners/runPreset";
import { Preset } from "../types/presets";
import { promptForPresetOptions } from "./promptForPresetOptions";
import { setupContext } from "./setupContext";

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
