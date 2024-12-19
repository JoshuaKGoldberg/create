import fs from "node:fs/promises";

import { clearLocalGitTags } from "../modes/clearLocalGitTags.js";
import { createRepositoryOnGitHub } from "../modes/createRepositoryOnGitHub.js";
import { createTrackingBranches } from "../modes/createTrackingBranches.js";
import { CreationOptions, ProductionMode } from "../modes/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { producePreset } from "../producers/producePreset.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { PromiseOrSync } from "../utils/promises.js";
import { applyCreation } from "./applyCreation.js";

export interface AugmentingPresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options?: Partial<InferredObject<OptionsShape>>;
	optionsAugment: (
		options: Partial<InferredObject<OptionsShape>>,
	) => PromiseOrSync<InferredObject<OptionsShape>>;
}

export interface FullPresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options: InferredObject<OptionsShape>;
	optionsAugment?: (
		options: InferredObject<OptionsShape>,
	) => Promise<Partial<InferredObject<OptionsShape>>>;
}

export interface RunSettingsBase extends Partial<NativeSystem> {
	auth?: string;
	// TODO: make directory required in options?
	directory?: string;
	mode?: ProductionMode;
}

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings:
		| AugmentingPresetRunSettings<OptionsShape>
		| FullPresetRunSettings<OptionsShape>,
): Promise<void> {
	const { directory = "." } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const { creation, options } = await producePreset(
		preset,
		// TODO: Why is this assertion necessary?
		{
			...system,
			...settings,
		} as FullPresetRunSettings<OptionsShape>,
	);

	if (settings.mode === "initialize") {
		// TODO: Hardcode owner and repository existing in options?
		await createRepositoryOnGitHub(
			options as unknown as CreationOptions,
			system,
			preset.base.template,
		);
	}

	await applyCreation(creation, system);

	if (settings.mode === "initialize") {
		await createTrackingBranches(
			options as unknown as CreationOptions,
			system.runner,
		);

		if (preset.base.template) {
			await clearLocalGitTags(system.runner);
		}
	}
}
