export function createFailingFunction(label: string) {
	return () => failingFunction(label);
}

export function failingFunction(label: string): never {
	throw new Error(
		`Context property '${label}' was used by a block but not provided.`,
	);
}

export function createFailingObject(label: string) {
	return new Proxy(
		{},
		{
			get: createFailingFunction(label),
		},
	);
}
