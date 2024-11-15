import { BlockWithArgs } from "../types/blocks.js";

export function mergeAddons<Args, Options>(
	first: BlockWithArgs<Args, Options>[] | undefined,
	second: BlockWithArgs<Args, Options>[] | undefined,
) {
	// ...TODO: actually merge
	return [...(first ?? []), ...(second ?? [])];
}
