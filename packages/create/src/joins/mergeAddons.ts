import { CreatedBlockAddons } from "../types/creations.js";

export function mergeAddons<Addons extends object, Options extends object>(
	first: CreatedBlockAddons<Addons, Options>[] | undefined,
	second: CreatedBlockAddons<Addons, Options>[] | undefined,
) {
	// ...TODO: actually merge? What to do here?
	return [...(first ?? []), ...(second ?? [])];
}
