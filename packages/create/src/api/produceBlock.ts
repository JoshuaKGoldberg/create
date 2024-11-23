import { HasOnlyRequiredProperties } from "../options.js";
import {
	BlockWithOptionalArgs,
	BlockWithoutArgs,
	BlockWithRequiredArgs,
} from "../types/blocks.js";
import { Creation, IndirectCreation } from "../types/creations.js";

export interface BlockProductionSettingsWithoutArgs<Options> {
	created?: Partial<IndirectCreation<Options>>;
	options?: Options;
}

export interface BlockProductionSettingsWithRequiredArgs<
	Args extends object,
	Options,
> extends BlockProductionSettingsWithoutArgs<Options> {
	args: Args;
}

export interface BlockProductionSettingsWithOptionalArgs<
	Args extends object,
	Options,
> extends BlockProductionSettingsWithoutArgs<Options> {
	args?: Args;
}

export type BlockProductionSettings<
	Args extends object | undefined,
	Options,
> = Args extends object
	? HasOnlyRequiredProperties<Args> extends true
		? BlockProductionSettingsWithRequiredArgs<Args, Options>
		: BlockProductionSettingsWithOptionalArgs<Args, Options>
	: BlockProductionSettingsWithoutArgs<Options>;

export function produceBlock<Args extends object, Options>(
	block: BlockWithRequiredArgs<Args, Options>,
	settings: BlockProductionSettingsWithRequiredArgs<Args, Options>,
): Partial<Creation<Options>>;
export function produceBlock<Args extends object, Options>(
	block: BlockWithOptionalArgs<Args, Options>,
	settings: BlockProductionSettingsWithOptionalArgs<Args, Options>,
): Partial<Creation<Options>>;
export function produceBlock<Options>(
	block: BlockWithoutArgs<Options>,
	settings: BlockProductionSettingsWithoutArgs<Options>,
): Partial<Creation<Options>>;
export function produceBlock<Args extends object, Options>(
	block: BlockWithOptionalArgs<Args, Options> | BlockWithoutArgs<Options>,
	settings: BlockProductionSettingsWithOptionalArgs<Args, Options>,
): Partial<Creation<Options>> {
	const blockData = block(settings.args);

	return blockData.produce({
		...("args" in blockData && { args: blockData.args }),
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		options: settings.options!,
	});
}
