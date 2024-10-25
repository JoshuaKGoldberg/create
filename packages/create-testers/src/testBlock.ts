import {
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
	Creation,
	IndirectCreation,
	TakeInput,
} from "create";

import {
	createFailingFunction,
	createFailingObject,
	failingFunction,
} from "./utils.js";

export interface BlockContextSettingsWithoutArgs<Options extends object> {
	created?: Partial<IndirectCreation>;
	options?: Options;
	take?: TakeInput;
}

export interface BlockContextSettingsWithRequiredArgs<
	Options extends object,
	Args extends object,
> extends BlockContextSettingsWithoutArgs<Options> {
	args: Args;
}

export interface BlockContextSettingsWithOptionalArgs<
	Options extends object,
	Args extends object,
> extends BlockContextSettingsWithoutArgs<Options> {
	args?: Args;
}

export async function testBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithRequiredArgs<Options, Args>,
	settings: BlockContextSettingsWithRequiredArgs<Options, Args>,
): Promise<Partial<Creation>>;
export async function testBlock<Options extends object>(
	blockFactory: BlockFactoryWithoutArgs<Options>,
	settings?: BlockContextSettingsWithoutArgs<Options>,
): Promise<Partial<Creation>>;
export async function testBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithOptionalArgs<Options, Args>,
	settings?: BlockContextSettingsWithOptionalArgs<Options, Args>,
): Promise<Partial<Creation>>;
export async function testBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithOptionalArgs<Options, Args>,
	settings: BlockContextSettingsWithOptionalArgs<Options, Args> = {},
): Promise<Partial<Creation>> {
	return await blockFactory(settings.args).produce({
		get args() {
			return failingFunction("args", "a block");
		},
		options: createFailingObject("options", "a block") as Options,
		take: createFailingFunction("take", "a block"),
		...settings,
		created: {
			documentation: {},
			editor: {},
			jobs: [],
			metadata: [],
			...settings.created,
		},
	});
}
