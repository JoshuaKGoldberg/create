import { Block, BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons, Creation } from "../types/creations.js";
import { mergeAddonsIfUpdated } from "./mergeAddonsIfUpdated.js";

export interface BlockProduction<
	Addons extends object | undefined,
	Options extends object,
> {
	addons: Addons;
	creation?: Partial<Creation<Options>>;
}

export function getUpdatedBlockAddons<Options extends object>(
	allowedBlocks: Set<Block<object | undefined, Options>>,
	blockProductions: Map<
		Block<object | undefined, Options>,
		BlockProduction<object, Options>
	>,
	newBlockAddons: CreatedBlockAddons<object, Options>[] = [],
) {
	const updated: [BlockWithAddons<object, Options>, object][] = [];

	for (const newAddons of newBlockAddons) {
		if (!allowedBlocks.has(newAddons.block)) {
			continue;
		}

		const existingProduction = blockProductions.get(newAddons.block);
		if (!existingProduction) {
			updated.push([newAddons.block, newAddons.addons]);
			continue;
		}

		const updatedAddons = mergeAddonsIfUpdated(
			existingProduction.addons,
			newAddons.addons,
		);
		if (updatedAddons) {
			updated.push([newAddons.block, updatedAddons]);
		}
	}

	return updated;
}
