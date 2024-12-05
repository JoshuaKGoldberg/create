import { CreatedBlockAddons } from "../types/creations.js";

export function overrideAddons<Addons extends object, Options extends object>(
	first: CreatedBlockAddons<Addons, Options>[] | undefined,
	second: CreatedBlockAddons<Addons, Options>[] | undefined,
) {
	return [...(first ?? []), ...(second ?? [])];
}
