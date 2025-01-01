export async function tryCatchAsync<T>(promise: Promise<T>) {
	try {
		return await promise;
	} catch {
		return undefined;
	}
}
