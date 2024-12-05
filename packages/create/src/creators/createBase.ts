import { AnyOptionalShape, AnyShape, InferredObject } from "../options.js";
import { Base, BaseDefinition } from "../types/bases.js";
import {
	BlockContextWithAddons,
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
	FinalizationContextWithAddons,
} from "../types/blocks.js";
import { Preset, PresetDefinition } from "../types/presets.js";
import { assertNoDuplicateBlocks } from "./assertNoDuplicateBlocks.js";
import { applyZodDefaults, isDefinitionWithAddons } from "./utils.js";

export function createBase<OptionsShape extends AnyShape>(
	baseDefinition: BaseDefinition<OptionsShape>,
): Base<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

	function createBlock<AddonsShape extends AnyOptionalShape>(
		blockDefinition: BlockDefinitionWithAddons<AddonsShape, Options>,
	): BlockWithAddons<InferredObject<AddonsShape>, Options>;
	function createBlock(
		blockDefinition: BlockDefinitionWithoutAddons<Options>,
	): BlockWithoutAddons<Options>;
	function createBlock<AddonsShape extends AnyOptionalShape>(
		blockDefinition:
			| BlockDefinitionWithAddons<AddonsShape, Options>
			| BlockDefinitionWithoutAddons<Options>,
	) {
		// Blocks without Addons can't be called as functions.
		if (!isDefinitionWithAddons(blockDefinition)) {
			return blockDefinition;
		}

		const addonsSchema = blockDefinition.addons;

		type Addons = InferredObject<AddonsShape>;

		// Blocks with Addons do need to be callable as functions...
		function block(addons: Addons) {
			return { addons, block };
		}

		// ...and also still have the Block Definition properties.
		Object.assign(block, blockDefinition);

		// Both build() and finalize() for Blocks with Addons apply defaults to their values
		const { build, finalize } = blockDefinition;

		block.build = (context: BlockContextWithAddons<Addons, Options>) => {
			return build({
				...context,
				addons: applyZodDefaults(addonsSchema, context.addons),
			});
		};

		block.finalize =
			finalize &&
			((context: FinalizationContextWithAddons<Addons, Options>) => {
				return finalize({
					...context,
					addons: applyZodDefaults(addonsSchema, context.addons),
				});
			});

		return block as BlockWithAddons<Addons, Options>;
	}

	function createPreset(
		presetDefinition: PresetDefinition<Options>,
	): Preset<OptionsShape> {
		assertNoDuplicateBlocks(presetDefinition);

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
