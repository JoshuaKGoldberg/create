import { createNativeSystems } from "../system/createNativeSystems.js";
import {
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";
import { NativeSystem } from "../types/system.js";

export interface BlockProductionSettingsWithoutArgs<
	Options extends object = object,
> extends Partial<NativeSystem> {
	created?: Partial<IndirectCreation>;
	options?: Options;
}

export interface BlockProductionSettingsWithArgs<
	Options extends object = object,
	Args extends object = object,
> extends BlockProductionSettingsWithoutArgs<Options> {
	args: Args;
}

export interface BlockProductionSettingsWithOptionalArgs<
	Options extends object = object,
	Args extends object = object,
> extends BlockProductionSettingsWithoutArgs<Options> {
	args?: Args;
}

export type BlockProductionSettings<
	Options extends object,
	Args extends object | undefined,
> = Args extends object
	? BlockProductionSettingsWithArgs<Options, Args>
	: BlockProductionSettingsWithoutArgs<Options>;

export async function produceBlock<Options extends object>(
	blockFactory: BlockFactoryWithoutArgs<Options>,
	settings: BlockProductionSettingsWithoutArgs<Options>,
): Promise<Partial<Creation>>;
export async function produceBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithRequiredArgs<Options, Args>,
	settings: BlockProductionSettingsWithArgs<Options, Args>,
): Promise<Partial<Creation>>;
export async function produceBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithOptionalArgs<Options, Args>,
	settings: BlockProductionSettingsWithOptionalArgs<Options>,
): Promise<Partial<Creation>>;
export async function produceBlock<Options extends object, Args extends object>(
	blockFactory: BlockFactoryWithRequiredArgs<Options, Args>,
	settings: BlockProductionSettingsWithOptionalArgs<Options, Args>,
) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const block = blockFactory(settings.args!);

	return await block.produce({
		created: {
			documentation: {},
			editor: {},
			jobs: [],
			metadata: [],
			package: {},
			...settings.created,
		},
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		options: settings.options!,
		take: createNativeSystems(settings).take,
	});
}
