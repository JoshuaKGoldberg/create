import {
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
	Creation,
	IndirectCreation,
	TakeInput,
} from "create";

import { createFailingObject, failingFunction } from "./utils.js";

export interface BlockContextSettingsWithoutArgs<Metadata, Options> {
	created?: Partial<IndirectCreation<Metadata, Options>>;
	options?: Options;
}

export interface BlockContextSettingsWithRequiredArgs<Args, Metadata, Options>
	extends BlockContextSettingsWithoutArgs<Metadata, Options> {
	args: Args;
}

export interface BlockContextSettingsWithOptionalArgs<Args, Metadata, Options>
	extends BlockContextSettingsWithoutArgs<Metadata, Options> {
	args?: Args;
}

export function testBlock<Args, Metadata, Options>(
	blockFactory: BlockFactoryWithRequiredArgs<Args, Metadata, Options>,
	settings: BlockContextSettingsWithRequiredArgs<Args, Metadata, Options>,
): Partial<Creation<Metadata, Options>>;
export function testBlock<Metadata, Options>(
	blockFactory: BlockFactoryWithoutArgs<Metadata, Options>,
	settings?: BlockContextSettingsWithoutArgs<Metadata, Options>,
): Partial<Creation<Metadata, Options>>;
export function testBlock<Args, Metadata, Options>(
	blockFactory: BlockFactoryWithOptionalArgs<Args, Metadata, Options>,
	settings?: BlockContextSettingsWithOptionalArgs<Args, Metadata, Options>,
): Partial<Creation<Metadata, Options>>;
export function testBlock<Args, Metadata, Options>(
	blockFactory:
		| BlockFactoryWithoutArgs<Metadata, Options>
		| BlockFactoryWithRequiredArgs<Args, Metadata, Options>,
	settings: BlockContextSettingsWithOptionalArgs<Args, Metadata, Options> = {},
): Partial<Creation<Metadata, Options>> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return blockFactory(settings.args!).produce({
		get args() {
			return failingFunction("args", "the block");
		},
		options: createFailingObject("options", "the block") as Options,
		...settings,
		created: {
			addons: [],
			metadata: {} as Metadata,
			...settings.created,
		},
	});
}
