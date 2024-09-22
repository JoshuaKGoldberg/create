export function mergeDocumentation(
	first: Record<string, string> | undefined,
	second: Record<string, string> | undefined,
) {
	if (!first) {
		return second ?? {};
	}

	if (!second) {
		return first;
	}

	for (const i in first) {
		if (i in second && first[i] !== second[i]) {
			throw new Error(
				`Conflicting documentation for "${i}": "${first[i]}" vs. "${second[i]}"`,
			);
		}
	}

	return {
		...first,
		...second,
	};
}
