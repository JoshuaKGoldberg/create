export const createFailingFunction = (name: string) => () =>
	failingFunction(name);

export function failingFunction(name: string): never {
	throw new Error(
		`Context property '${name}' was used by a block but not provided.`,
	);
}
