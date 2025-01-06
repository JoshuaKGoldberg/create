import { AnyOptionalShape, AnyShape, InferredObject } from "../options.js";
import { Base, BaseDefinition } from "../types/bases.js";
import {
	BlockContextWithAddons,
	BlockDefinitionWithAddons,
	BlockDefinitionWithoutAddons,
	BlockWithAddons,
	BlockWithoutAddons,
} from "../types/blocks.js";
import { Preset, PresetDefinition } from "../types/presets.js";
import { Template, TemplateDefinition } from "../types/templates.js";
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

		block.produce = (context: BlockContextWithAddons<Addons, Options>) => {
			return blockDefinition.produce({
				...context,
				addons: applyZodDefaults(addonsSchema, context.addons),
			});
		};

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

	function createTemplate(
		templateDefinition: TemplateDefinition<OptionsShape>,
	): Template<OptionsShape> {
		return {
			...templateDefinition,
			options: base.options,
		};
	}

	const base = {
		...baseDefinition,
		createBlock,
		createPreset,
		createTemplate,
	};

	return base;
}
