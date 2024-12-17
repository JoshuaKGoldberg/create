export function applyMerger<T>(
	first: T | undefined,
	second: T | undefined,
	merger: (first: T, second: T) => T,
	fallback: T,
) {
	if (first == null || second == null) {
		return second ?? first ?? fallback;
	}

	return merger(first, second);
}
