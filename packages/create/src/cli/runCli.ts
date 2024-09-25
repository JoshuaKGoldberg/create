// import { runCreation } from "../runners/runCreation.js";
import { producePreset } from "../api/producePreset.js";
import { createSystemContext } from "../system/createSystemContext.js";
import { writeToSystem } from "../system/writeToSystem.js";
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

	const system = createSystemContext();
	const parsedOptions = parseZodArgs(args, preset.schema.options);

	const creation = await producePreset({
		augmentOptions: async (options) =>
			promptForPresetOptions(preset.schema.options, options),
		options: parsedOptions,
		preset,
		system,
	});

	console.log("I will do something with this creation:", creation.files);

	await writeToSystem(creation.files, system.fs);
	// await runCreation(creation, context);
}

void runCli(process.argv).then(() => {
	console.log("done.");
});
