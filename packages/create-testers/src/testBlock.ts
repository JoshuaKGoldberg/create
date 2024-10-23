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

export interface BlockContextOverridesWithoutArgs<Options extends object> {
	created?: Partial<IndirectCreation>;
	options?: Options;
	take?: TakeInput;
}

export interface BlockContextOverridesWithRequiredArgs<
	Options extends object,
	Args extends object,
> extends BlockContextOverridesWithoutArgs<Options> {
	args: Args;
}

export interface BlockContextOverridesWithOptionalArgs<
	Options extends object,
	Args extends object,
> extends BlockContextOverridesWithoutArgs<Options> {
	args?: Args;
}

export async function testBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithRequiredArgs<Options, Args>,
	overrides: BlockContextOverridesWithRequiredArgs<Options, Args>,
): Promise<Partial<Creation>>;
export async function testBlock<Options extends object>(
	blockFactory: BlockFactoryWithoutArgs<Options>,
	overrides?: BlockContextOverridesWithoutArgs<Options>,
): Promise<Partial<Creation>>;
export async function testBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithOptionalArgs<Options, Args>,
	overrides?: BlockContextOverridesWithOptionalArgs<Options, Args>,
): Promise<Partial<Creation>>;
export async function testBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithOptionalArgs<Options, Args>,
	overrides: BlockContextOverridesWithOptionalArgs<Options, Args> = {},
): Promise<Partial<Creation>> {
	return await blockFactory(overrides.args).produce({
		get args() {
			return failingFunction("args");
		},
		options: createFailingObject("options") as Options,
		take: createFailingFunction("take"),
		...overrides,
		created: {
			documentation: {},
			editor: {},
			jobs: [],
			metadata: [],
			...overrides.created,
		},
	});
}
