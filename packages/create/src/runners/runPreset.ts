import { getUpdatedBlockAddons } from "../mergers/getUpdatedBlockAddons.js";
import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Block } from "../types/blocks.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";

export function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	options: InferredObject<OptionsShape>,
	presetContext: SystemContext,
) {
	type Options = InferredObject<OptionsShape>;

	const blockDataToBeRun = new Set(preset.blocks);
	const blockAddons = new Map(
		preset.blocks
			.filter((data) => "args" in data)
			.map((data) => [data.block, data.args]),
	);
	const blockCreations = new Map<
		Block<object, Options>,
		Partial<Creation<Options>>
	>();

	// From (TODO).md:
	// This engine continuously re-runs Blocks until no new Args are provided.
	while (blockDataToBeRun.size) {
		// For each Block to be run:
		for (const currentBlockData of blockDataToBeRun) {
			blockDataToBeRun.delete(currentBlockData);

			const currentBlock = currentBlockData.block as Block<object, Options>;

			// 1. Get the Creation from the Block, passing any current known Args
			const currentArgs = blockAddons.get(currentBlock) ?? {};
			const blockCreation = currentBlockData.produce({
				...presetContext,
				args: currentArgs,
				options,
			});

			// 2. Store that Block's Creation for future use
			blockCreations.set(currentBlock, blockCreation);

			// 3. If the Block specified new addons for any other Blocks...
			const updatedBlockAddons = getUpdatedBlockAddons(
				blockAddons,
				blockCreation.addons,
			);

			// ...then we add them in to the queue of Blocks to re-run
			for (const [addedBlock, addedBlockArgs] of updatedBlockAddons) {
				blockAddons.set(addedBlock, addedBlockArgs);
				blockDataToBeRun.add(addedBlock(addedBlockArgs));
			}
		}
	}

	return Array.from(blockCreations.values()).reduce<Creation<Options>>(
		(created, next) => mergeCreations(created, next),
		{
			addons: [],
			commands: [],
			files: {},
		},
	);
}
