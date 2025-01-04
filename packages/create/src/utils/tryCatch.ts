export async function tryCatchError(promise: Promise<unknown>) {
	try {
		return await promise;
	} catch (error) {
		return error;
	}
}

export async function tryCatchSafe<T>(promise: Promise<T>) {
	try {
		return await promise;
	} catch {
		return undefined;
	}
}
