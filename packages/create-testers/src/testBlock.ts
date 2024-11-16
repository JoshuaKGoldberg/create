import {
	AnyBlockWithArgs,
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
	CreatedCommand,
	CreatedFiles,
	IndirectCreation,
} from "create";

import { createFailingObject, failingFunction } from "./utils.js";

export interface BlockContextSettingsWithoutArgs<Options> {
	created?: Partial<IndirectCreation<Options>>;
	options?: Options;
}

export interface BlockContextSettingsWithRequiredArgs<Args, Options>
	extends BlockContextSettingsWithoutArgs<Options> {
	args: Args;
}

export interface BlockContextSettingsWithOptionalArgs<Args, Options>
	extends BlockContextSettingsWithoutArgs<Options> {
	args?: Args;
}

export interface TestBlockCreation<Options> {
	addons: [BlockFactoryWithRequiredArgs<object, Options>, object][];
	commands: (CreatedCommand | string)[];
	files: CreatedFiles;
}

export function testBlock<Args, Options>(
	blockFactory: BlockFactoryWithRequiredArgs<Args, Options>,
	settings: BlockContextSettingsWithRequiredArgs<Args, Options>,
): Partial<TestBlockCreation<Options>>;
export function testBlock<Options>(
	blockFactory: BlockFactoryWithoutArgs<Options>,
	settings?: BlockContextSettingsWithoutArgs<Options>,
): Partial<TestBlockCreation<Options>>;
export function testBlock<Args, Options>(
	blockFactory: BlockFactoryWithOptionalArgs<Args, Options>,
	settings?: BlockContextSettingsWithOptionalArgs<Args, Options>,
): Partial<TestBlockCreation<Options>>;
export function testBlock<Args, Options>(
	blockFactory:
		| BlockFactoryWithoutArgs<Options>
		| BlockFactoryWithRequiredArgs<Args, Options>,
	settings: BlockContextSettingsWithOptionalArgs<Args, Options> = {},
): Partial<TestBlockCreation<Options>> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const production = blockFactory(settings.args!).produce({
		get args() {
			return failingFunction("args", "the block");
		},
		options: createFailingObject("options", "the block") as Options,
		...settings,
		created: {
			addons: [],
			...settings.created,
		},
	});

	return {
		...production,
		addons: production.addons?.map((addon) => [addon.factory, addon.args]),
	};
}
