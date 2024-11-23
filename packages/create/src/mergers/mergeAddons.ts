import { BlockDataWithArgs } from "../types/blocks.js";

export function mergeAddons<Args, Options>(
	first: BlockDataWithArgs<Args, Options>[] | undefined,
	second: BlockDataWithArgs<Args, Options>[] | undefined,
) {
	// ...TODO: actually merge
	return [...(first ?? []), ...(second ?? [])];
}
