import { BlockModifications } from "../config/types.js";
import { Block } from "../types/blocks.js";

export function applyBlockModifications<Options extends object>(
	initial: Block<object | undefined, Options>[],
	{ add = [], remove = [] }: BlockModifications<Options> = {},
) {
	if (!add.length && !remove.length) {
		return initial;
	}

	const blocks = new Set(initial);

	for (const added of add) {
		blocks.add(added);
	}

	for (const removed of remove) {
		blocks.delete(removed);
	}

	return Array.from(blocks);
}
