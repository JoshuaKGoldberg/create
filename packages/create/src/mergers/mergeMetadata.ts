export function mergeMetadata<Metadata>(
	first: Metadata,
	second: Metadata | undefined,
) {
	// ...TODO: actually merge
	return {
		...first,
		...second,
	};
}
