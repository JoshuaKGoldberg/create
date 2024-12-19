export function removeEmptyProperties<T extends object>(value: T): T {
	for (const k in value) {
		if (value[k] === undefined) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete value[k];
		}
	}

	return value;
}
