import { isNotUndefined } from "../utils";

export function mergeArrays<T>(
	...arrays: (T[] | undefined)[]
): T[] | undefined {
	const result = arrays.filter(isNotUndefined).flat();

	return result.length ? result : undefined;
}
