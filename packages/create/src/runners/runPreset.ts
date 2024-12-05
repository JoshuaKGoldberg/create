import {
	BlockProduction,
	getUpdatedBlockAddons,
} from "../joins/getUpdatedBlockAddons.js";
import { mergeCreations } from "../joins/mergeCreations.js";
import { overrideCreations } from "../joins/overrideCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Block } from "../types/blocks.js";
import { Creation, DirectCreation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";

export async function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	options: InferredObject<OptionsShape>,
	presetContext: SystemContext,
): Promise<DirectCreation> {
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
			const blockCreation = currentBlock.build({
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
	let created = Array.from(blockProductions.values()).reduce<Creation<Options>>(
		(created, next) => mergeCreations(created, next.creation ?? {}),
		{
			addons: [],
			commands: [],
			files: {},
		},
	);

	//	4. Run Block finalization functions on that result, overriding instead of merging
	for (const block of preset.blocks) {
		if (block.finalize) {
			created = overrideCreations(
				created,
				await block.finalize({
					// If the Block has addons, they would have been in the Map by now
					// (Block is typed as *WithAddons, but should be *WithAddons | *WithoutAddons)
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
					addons: blockProductions.get(block)?.addons!,
					created,
					options,
				}),
			);
		}
	}

	return {
		commands: created.commands,
		files: created.files,
	};
}
