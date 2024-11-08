import { isNotUndefined } from "../utils/values.js";

export function mergeArrays<T>(...arrays: (T[] | undefined)[]) {
	return arrays.filter(isNotUndefined).flat();
}
