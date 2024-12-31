export interface CreationOptions {
	owner: string;
	repository: string;
}

export function assertOptionsForInitialize(
	options: object,
): asserts options is CreationOptions {
	for (const key of ["owner", "repository"]) {
		if (typeof (options as Record<string, unknown>)[key] !== "string") {
			throw new Error(
				`To run with --mode initialize, the Template must have a --${key} Option of type string.`,
			);
		}
	}
}
