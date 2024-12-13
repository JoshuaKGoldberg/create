import {
	BlockProduction,
	getUpdatedBlockAddons,
} from "../mergers/getUpdatedBlockAddons.js";
import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Block } from "../types/blocks.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";

export function executePresetBlocks<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	options: InferredObject<OptionsShape>,
	presetContext: SystemContext,
) {
	type Options = InferredObject<OptionsShape>;

	// From engine/runtime/merging.md:
	// This engine continuously re-runs Blocks until no new Args are provided.

	const blockProductions = new Map<
		Block<object | undefined, Options>,
		BlockProduction<object, Options>
	>();

	// 1. Create a queue of Blocks to be run, starting with all defined in the Preset
	const blocksToBeRun = new Set(preset.blocks);

	// 2. For each Block in the queue:
	while (blocksToBeRun.size) {
		for (const currentBlock of blocksToBeRun) {
			blocksToBeRun.delete(currentBlock);

			// 2.1. Get the Creation from the Block, passing any current known Args
			const previousProduction = blockProductions.get(currentBlock);
			const previousAddons = previousProduction?.addons ?? {};
			const blockCreation = currentBlock.produce({
				...presetContext,
				addons: previousAddons,
				options,
			});

			// 2.2. Store that Block's Creation
			blockProductions.set(currentBlock, {
				addons: previousAddons,
				creation: blockCreation,
			});

			// 2.3. If the Block specified new addons for any other Blocks:
			const updatedBlockAddons = getUpdatedBlockAddons(
				blockProductions,
				blockCreation.addons,
			);

			// 2.3.1: Add those Blocks to the queue to re-run
			for (const [updatedBlock, updatedAddons] of updatedBlockAddons) {
				const addedBlockPreviousProduction = blockProductions.get(updatedBlock);
				blockProductions.set(updatedBlock, {
					...addedBlockPreviousProduction,
					addons: updatedAddons,
				});
				blocksToBeRun.add(updatedBlock);
			}
		}
	}

	// 3. Merge all Block Creations together
	return Array.from(blockProductions.values()).reduce<Creation<Options>>(
		(created, next) => mergeCreations(created, next.creation ?? {}),
		{
			addons: [],
			files: {},
			scripts: [],
		},
	);
}
