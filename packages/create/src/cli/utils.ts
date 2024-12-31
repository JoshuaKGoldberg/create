export function isLocalPath(from: string) {
	return [".", "/", "~"].includes(from[0]);
}

export function makeRelative(item: string) {
	return item.startsWith(".") ? item : `./${item}`;
}

export async function swallowAsync<T>(task: Promise<T>) {
	try {
		return await task;
	} catch {
		return undefined;
	}
}
