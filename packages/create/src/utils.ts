export type PromiseOrSync<T> = Promise<T> | T;

export function isNotUndefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}
