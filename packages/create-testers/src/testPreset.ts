// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/unified-signatures */
import {
	AnyShape,
	Creation,
	FullPresetProductionSettings,
	InferredObject,
	Preset,
	producePreset,
	PromiseOrSync,
	SystemContext,
	TakeInput,
	WritingFileSystem,
} from "create";

import { createFailingFunction } from "./utils.js";

export interface TestProductionSettingsBase {
	system?: Partial<SystemContext>;
}

export interface TestAugmentingPresetProductionSettings<
	OptionsShape extends AnyShape,
> extends TestProductionSettingsBase {
	options?: Partial<InferredObject<OptionsShape>>;
	optionsAugment: (
		options: Partial<InferredObject<OptionsShape>>,
	) => PromiseOrSync<InferredObject<OptionsShape>>;
}

export interface TestFullPresetProductionSettings<OptionsShape extends AnyShape>
	extends TestProductionSettingsBase {
	options: InferredObject<OptionsShape>;
	optionsAugment?: (
		options: InferredObject<OptionsShape>,
	) => Promise<Partial<InferredObject<OptionsShape>>>;
}
export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: TestAugmentingPresetProductionSettings<OptionsShape>,
): Promise<Creation>;
export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings: TestFullPresetProductionSettings<OptionsShape>,
): Promise<Creation>;
export async function testPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	settings:
		| TestAugmentingPresetProductionSettings<OptionsShape>
		| TestFullPresetProductionSettings<OptionsShape>,
) {
	const fs: WritingFileSystem = {
		...settings.system?.fs,
		readFile: createFailingFunction("fs.readFile", "an input"),
		writeDirectory: createFailingFunction("fs.writeDirectory", "an input"),
		writeFile: createFailingFunction("fs.writeFile", "an input"),
	};
	const fetcher =
		settings.system?.fetcher ?? createFailingFunction("fetcher", "an input");
	const runner =
		settings.system?.runner ?? createFailingFunction("runner", "an input");
	const take: TakeInput =
		settings.system?.take ??
		((input, args) =>
			input({ args, fetcher, fs, runner, take } as Parameters<TakeInput>[0]));

	const system: SystemContext = {
		...settings.system,
		fetcher,
		fs,
		runner,
		take,
	};

	return await producePreset(preset, {
		...settings,
		system,
	} as FullPresetProductionSettings<OptionsShape>);
}
