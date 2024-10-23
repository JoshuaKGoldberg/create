import {
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";

const createFailingFunction = (name: string) => () => failingFunction(name);

function failingFunction(name: string): never {
	throw new Error(
		`Context property '${name}' was used by a block but not provided.`,
	);
}

export interface BlockProductionSettings<
	Options extends object = object,
	Args extends object = object,
> {
	args?: Args;
	created?: Partial<IndirectCreation>;
	options?: Options;
}

function createBlockProductionContext<
	Options extends object,
	Args extends object,
>(settings: BlockProductionSettings<Options, Args> = {}) {
	return {
		created: {
			documentation: {},
			editor: {},
			jobs: [],
			metadata: [],
			...settings.created,
		},
		get options() {
			return settings.options ?? failingFunction("options");
		},
		take: createFailingFunction("take"),
	};
}

export async function produceBlock<Options extends object>(
	blockFactory: BlockFactoryWithoutArgs<Options>,
	settings: BlockProductionSettings<Options>,
): Promise<Partial<Creation>>;
export async function produceBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithRequiredArgs<Options, Args>,
	settings: BlockProductionSettings<Options, Args>,
): Promise<Partial<Creation>>;
export async function produceBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithOptionalArgs<Options, Args>,
	settings: BlockProductionSettings<Options>,
): Promise<Partial<Creation>>;
export async function produceBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithRequiredArgs<Options, Args>,
	settings: BlockProductionSettings<Options, Args>,
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const block = blockFactory(settings.args!);
	const context = createBlockProductionContext(settings);
	return await block.produce(context);
}
