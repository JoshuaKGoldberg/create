import {
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";

export interface BlockProductionSettingsWithoutArgs<Options> {
	created?: Partial<IndirectCreation<Options>>;
	options?: Options;
}
export interface BlockProductionSettingsWithArgs<Args extends object, Options>
	extends BlockProductionSettingsWithoutArgs<Options> {
	args: Args;
}

export type BlockProductionSettings<
	Args extends object | undefined,
	Options,
> = Args extends object
	? BlockProductionSettingsWithArgs<Args, Options>
	: BlockProductionSettingsWithoutArgs<Options>;

export function produceBlock<Args extends object, Options>(
	blockFactory: BlockFactoryWithRequiredArgs<Args, Options>,
	settings: BlockProductionSettingsWithArgs<Args, Options>,
): Partial<Creation<Options>>;
export function produceBlock<Options>(
	blockFactory: BlockFactoryWithoutArgs<Options>,
	settings: BlockProductionSettingsWithoutArgs<Options>,
): Partial<Creation<Options>>;
export function produceBlock<Args extends object, Options>(
	blockFactory:
		| BlockFactoryWithoutArgs<Options>
		| BlockFactoryWithRequiredArgs<Args, Options>,
	settings:
		| BlockProductionSettingsWithArgs<Args, Options>
		| BlockProductionSettingsWithoutArgs<Options>,
): Partial<Creation<Options>> {
	// TODO: Figure out how to remove the unions in the implementation signature
	type Settings = BlockProductionSettingsWithArgs<Args, Options>;
	const block = blockFactory((settings as Settings).args);

	return block.produce({
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		options: settings.options!,
	});
}
