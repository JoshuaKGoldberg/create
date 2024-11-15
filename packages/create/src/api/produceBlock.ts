import {
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";

export interface BlockProductionSettingsWithoutArgs<Metadata, Options> {
	created?: Partial<IndirectCreation<Metadata, Options>>;
	options?: Options;
}
export interface BlockProductionSettingsWithArgs<
	Args extends object,
	Metadata,
	Options,
> extends BlockProductionSettingsWithoutArgs<Metadata, Options> {
	args: Args;
}

export type BlockProductionSettings<
	Args extends object | undefined,
	Metadata,
	Options,
> = Args extends object
	? BlockProductionSettingsWithArgs<Args, Metadata, Options>
	: BlockProductionSettingsWithoutArgs<Metadata, Options>;

export function produceBlock<Args extends object, Metadata, Options>(
	blockFactory: BlockFactoryWithRequiredArgs<Args, Metadata, Options>,
	settings: BlockProductionSettingsWithArgs<Args, Metadata, Options>,
): Partial<Creation<Metadata, Options>>;
export function produceBlock<Metadata, Options>(
	blockFactory: BlockFactoryWithoutArgs<Metadata, Options>,
	settings: BlockProductionSettingsWithoutArgs<Metadata, Options>,
): Partial<Creation<Metadata, Options>>;
export function produceBlock<Args extends object, Metadata, Options>(
	blockFactory:
		| BlockFactoryWithoutArgs<Metadata, Options>
		| BlockFactoryWithRequiredArgs<Args, Metadata, Options>,
	settings:
		| BlockProductionSettingsWithArgs<Args, Metadata, Options>
		| BlockProductionSettingsWithoutArgs<Metadata, Options>,
): Partial<Creation<Metadata, Options>> {
	// TODO: Figure out how to remove the unions in the implementation signature
	type Settings = BlockProductionSettingsWithArgs<Args, Metadata, Options>;
	const block = blockFactory((settings as Settings).args);

	return block.produce({
		created: {
			addons: [],
			metadata: {} as Metadata,
			...settings.created,
		},
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		options: settings.options!,
	});
}
