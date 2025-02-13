export function createFailingFunction(label: string, user: string) {
	return () => failingFunction(label, user);
}

function failingFunction(label: string, user: string): never {
	throw new Error(
		`Context property '${label}' was used by ${user} but not provided.`,
	);
}
