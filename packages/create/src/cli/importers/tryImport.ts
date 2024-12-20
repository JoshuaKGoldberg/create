export async function tryImport(source: string, attributes?: ImportAttributes) {
	try {
		return (await import(source), attributes) as object;
	} catch (error) {
		return error as Error;
	}
}
