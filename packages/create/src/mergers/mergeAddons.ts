import { BlockWithArgs } from "../types/blocks.js";

export function mergeAddons<Args, Metadata, Options>(
	first: BlockWithArgs<Args, Metadata, Options>[] | undefined,
	second: BlockWithArgs<Args, Metadata, Options>[] | undefined,
) {
	// ...TODO: actually merge
	return [...(first ?? []), ...(second ?? [])];
}
