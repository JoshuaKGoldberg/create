export type AwaitedCalledProperty<T> = T extends () => infer R ? Awaited<R> : T;

export type AwaitedCalledProperties<T> = {
	[K in keyof T]: AwaitedCalledProperty<T[K]>;
};

export async function awaitCalledProperties<T extends object>(
	source: T,
): Promise<AwaitedCalledProperties<T>> {
	const result: Record<string, unknown> = {};
	const tasks: Promise<void>[] = [];

	for (const [key, value] of Object.entries(source)) {
		if (typeof value !== "function") {
			continue;
		}

		const task = (value as () => unknown)();

		if (task instanceof Promise) {
			tasks.push(
				task.then((awaited) => {
					result[key] = awaited;
				}),
			);
		}
	}

	await Promise.all(tasks);

	return result as AwaitedCalledProperties<T>;
}
