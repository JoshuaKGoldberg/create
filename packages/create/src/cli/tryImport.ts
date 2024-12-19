export async function tryImport(source: string) {
	try {
		return (await import(source)) as object;
	} catch (error) {
		return error as Error;
	}
}
