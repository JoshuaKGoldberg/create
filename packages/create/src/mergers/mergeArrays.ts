import { isNotUndefined } from "../utils.js";

export function mergeArrays<T>(...arrays: (T[] | undefined)[]) {
	return arrays.filter(isNotUndefined).flat();
}
