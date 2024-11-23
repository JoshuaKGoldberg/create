import { AnyOptionalShape, AnyShape, InferredObject } from "../options.js";
import { Base, BaseDefinition } from "../types/bases.js";
import {
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockWithOptionalArgs,
	BlockWithoutArgs,
	BlockWithRequiredArgs,
} from "../types/blocks.js";
import { Preset, PresetDefinition } from "../types/presets.js";

export function createBase<OptionsShape extends AnyShape>(
	baseDefinition: BaseDefinition<OptionsShape>,
): Base<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

	function createBlock<ArgsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockWithOptionalArgs<InferredObject<ArgsShape>, Options>;
	function createBlock<ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockWithRequiredArgs<InferredObject<ArgsShape>, Options>;
	function createBlock(
		blockDefinition: BlockDefinitionWithoutArgs<Options>,
	): BlockWithoutArgs<Options>;
	function createBlock<ArgsShape extends AnyShape>(
		blockDefinition:
			| BlockDefinitionWithArgs<ArgsShape, Options>
			| BlockDefinitionWithoutArgs<Options>,
	) {
		type Args = InferredObject<ArgsShape>;

		const block = (args: Args) => {
			return {
				...blockDefinition,
				args,
				block,
			};
		};

		return block as
			| BlockWithoutArgs<Options>
			| BlockWithRequiredArgs<Args, Options>;
	}

	function createPreset(
		presetDefinition: PresetDefinition<Options>,
	): Preset<OptionsShape> {
		return {
			...presetDefinition,
			base,
		};
	}

	const base = {
		...baseDefinition,
		createBlock,
		createPreset,
	};

	return base;
}
