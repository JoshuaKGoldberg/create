import {
	BlockProduction,
	getUpdatedBlockAddons,
} from "../mergers/getUpdatedBlockAddons.js";
import { mergeCreations } from "../mergers/mergeCreations.js";
import { Block, BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { ProductionMode } from "../types/modes.js";
import { SystemContext } from "../types/system.js";
import { produceBlock } from "./produceBlock.js";

export interface ExecutePresetBlocksSettings<Options extends object> {
	// TODO: I don't know what to put here instead of object...
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addons?: CreatedBlockAddons<any, Options>[];
	blocks: Block<object | undefined, Options>[];
	mode?: ProductionMode;
	options: Options;
	presetContext: SystemContext;
}

export function executePresetBlocks<Options extends object>({
	addons,
	blocks,
	mode,
	options,
	presetContext,
}: ExecutePresetBlocksSettings<Options>) {
	// From engine/runtime/execution.md:
	// This engine continuously re-runs Blocks until no new Args are provided.

	const blockProductions = new Map<
		Block<object | undefined, Options>,
		BlockProduction<object, Options>
	>(addons?.map((addon) => [addon.block, { addons: addon.addons as object }]));

	// 1. Create a queue of Blocks to be run, starting with all defined in the Preset
	const allowedBlocks = new Set(blocks);
	const blocksToBeRun = new Set(blocks);

	// 2. For each Block in the queue:
	while (blocksToBeRun.size) {
		for (const currentBlock of blocksToBeRun) {
			blocksToBeRun.delete(currentBlock);

			// 2.1. Get the Creation from the Block, passing any current known Addons
			// 2.2. If a mode is specified, additionally generate the appropriate Block Creations
			const previousProduction = blockProductions.get(currentBlock);
			const previousAddons = previousProduction?.addons ?? {};
			const blockCreation = produceBlock(
				currentBlock as BlockWithAddons<object, Options>,
				{
					...presetContext,
					addons: previousAddons,
					mode,
					options,
				},
			);

			// 2.3. Store that Block's Creation
			blockProductions.set(currentBlock, {
				addons: previousAddons,
				creation: blockCreation,
			});

			// 2.4. If the Block specified new addons for any defined Blocks:
			const updatedBlockAddons = getUpdatedBlockAddons(
				allowedBlocks,
				blockProductions,
				blockCreation.addons,
			);

			// 2.4.1: Add those Blocks to the queue to re-run
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
	return Array.from(blockProductions.values()).reduce<
		Partial<Creation<Options>>
	>((created, next) => mergeCreations(created, next.creation ?? {}), {});
}
