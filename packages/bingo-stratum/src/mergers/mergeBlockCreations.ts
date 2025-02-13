import { applyMerger, mergeCreations } from "bingo";
import { withoutUndefinedProperties } from "without-undefined-properties";

import { BlockCreation } from "../types/creations.js";
import { mergeAddons } from "./mergeAddons.js";

export function mergeBlockCreations<
	Options extends object,
	First extends Partial<BlockCreation<Options>>,
	Second extends Partial<BlockCreation<Options>>,
>(first: First, second: Second): First & Second {
	return withoutUndefinedProperties({
		...mergeCreations(first, second),
		addons: applyMerger(first.addons, second.addons, mergeAddons),
	}) as First & Second;
}
