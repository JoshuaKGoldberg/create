import { Block, BlockDataWithArgs, BlockWithArgs } from "../types/blocks.js";
import { mergeArgsIfUpdated } from "./mergeArgsIfUpdated.js";

export function getUpdatedBlockAddons<Options>(
	existingBlockArgs: Map<Block<object, Options>, object>,
	newBlockAddons: BlockDataWithArgs<object, Options>[] = [],
) {
	const updated: [BlockWithArgs<object, Options>, object][] = [];

	for (const newAddons of newBlockAddons) {
		const existingArgs = existingBlockArgs.get(newAddons.block);
		if (!existingArgs) {
			updated.push([newAddons.block, newAddons.args]);
			continue;
		}

		const updatedArgs = mergeArgsIfUpdated(existingArgs, newAddons.args);
		if (updatedArgs) {
			updated.push([newAddons.block, updatedArgs]);
		}
	}

	return updated;
}
