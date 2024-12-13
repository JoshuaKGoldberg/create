import fs from "node:fs/promises";

import { createRepositoryOnGitHub } from "../modes/createRepositoryOnGitHub.js";
import { createTrackingBranches } from "../modes/createTrackingBranches.js";
import { CreationOptions, ProductionMode } from "../modes/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { producePreset } from "../producers/producePreset.js";
import { createSystemContext } from "../system/createSystemContext.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { PromiseOrSync } from "../utils/promises.js";
import { applyCreation } from "./applyCreation.js";

export interface RunSettingsBase extends Partial<NativeSystem> {
	// TODO: make directory required in options?
	directory?: string;
	mode?: ProductionMode;
}

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

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings:
		| AugmentingPresetRunSettings<OptionsShape>
		| FullPresetRunSettings<OptionsShape>,
): Promise<void> {
	const { directory = "." } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = createSystemContext({
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

	if (settings.mode === "new") {
		// TODO: Hardcode owner and repository existing in options?
		await createRepositoryOnGitHub(
			options as unknown as CreationOptions,
			system.runner,
			preset.base.template,
		);
	}

	await applyCreation(creation, system);

	if (settings.mode === "new") {
		await createTrackingBranches(
			options as unknown as CreationOptions,
			system.runner,
		);
	}
}
