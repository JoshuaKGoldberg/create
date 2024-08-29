import { isNotUndefined } from "../utils.js";

export function mergeArrays<T>(
	...arrays: (T[] | undefined)[]
): T[] | undefined {
	const result = arrays.filter(isNotUndefined).flat();

	return result.length ? result : undefined;
}
