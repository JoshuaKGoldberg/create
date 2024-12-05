export function removeEmptyEntries<T>(result: T) {
	for (const i in result) {
		if (result[i as keyof T] === undefined) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete result[i as keyof T];
		}
	}

	return result;
}
