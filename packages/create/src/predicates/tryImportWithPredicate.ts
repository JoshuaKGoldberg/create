export async function tryImportWithPredicate<T>(
	importer: (moduleName: string) => Promise<object>,
	moduleName: string,
	predicate: (value: unknown) => value is T,
	typeName: string,
): Promise<Error | T> {
	const templateModule = await importer(moduleName);
	if (templateModule instanceof Error) {
		return templateModule;
	}

	if (!("default" in templateModule)) {
		return new Error(
			`${moduleName} should have a default exported ${typeName}.`,
		);
	}

	const value = templateModule.default;
	if (!predicate(value)) {
		return new Error(
			`The default export of ${moduleName} should be a ${typeName}.`,
		);
	}

	console.log({ value });
	return value;
}
