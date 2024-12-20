import fs from "node:fs/promises";

import { assertOptionsForInitialize } from "../cli/initialize/assertOptionsForInitialize.js";
import { clearLocalGitTags } from "../modes/clearLocalGitTags.js";
import { createRepositoryOnGitHub } from "../modes/createRepositoryOnGitHub.js";
import { createTrackingBranches } from "../modes/createTrackingBranches.js";
import { ProductionMode } from "../modes/types.js";
import { AnyShape, InferredObject } from "../options.js";
import { producePreset } from "../producers/producePreset.js";
import { createSystemContextWithAuth } from "../system/createSystemContextWithAuth.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { NativeSystem } from "../types/system.js";
import { applyCreation } from "./applyCreation.js";

export interface AugmentingPresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options?: Partial<InferredObject<OptionsShape>>;
}

export interface PresetRunSettings<OptionsShape extends AnyShape>
	extends RunSettingsBase {
	options: InferredObject<OptionsShape>;
}

export interface RunSettingsBase extends Partial<NativeSystem> {
	auth?: string;
	directory?: string;
	mode?: ProductionMode;
}

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: PresetRunSettings<OptionsShape>,
): Promise<Creation<InferredObject<OptionsShape>>> {
	const { directory = ".", options } = settings;
	await fs.mkdir(directory, { recursive: true });

	const system = await createSystemContextWithAuth({
		directory,
		...settings,
	});

	const run = async () => {
		const creation = await producePreset(preset, { ...system, ...settings });
		await applyCreation(creation, system);
		return creation;
	};

	if (settings.mode !== "initialize") {
		return await run();
	}

	assertOptionsForInitialize(options);

	await createRepositoryOnGitHub(
		options,
		system.fetchers.octokit,
		preset.base.template,
	);

	const creation = await run();

	await createTrackingBranches(options, system.runner);

	if (preset.base.template) {
		await clearLocalGitTags(system.runner);
	}

	return creation;
}
