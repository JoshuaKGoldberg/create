import { createNativeSystems } from "../system/createNativeSystems.js";
import {
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";
import { NativeSystem } from "../types/system.js";

export interface BlockProductionSettings<
	Options extends object = object,
	Args extends object = object,
> extends Partial<NativeSystem> {
	args?: Args;
	created?: Partial<IndirectCreation>;
	options?: Options;
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

	return await block.produce({
		created: {
			documentation: {},
			editor: {},
			jobs: [],
			metadata: [],
			...settings.created,
		},
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		options: settings.options!,
		take: createNativeSystems(settings).take,
	});
}
