import enhancedResolve from "enhanced-resolve";
import * as fsClassic from "node:fs";
import * as fs from "node:fs/promises";
import path from "node:path";
import precinct from "precinct";

import { debounce } from "./debounce.js";

export async function onSourcesChange(
	onChange: () => Promise<void>,
	onError: (error: unknown) => void,
	sources: string[],
) {
	const filesToWatch = new Set<string>();

	for (const source of sources) {
		const main = await new Promise<Error | string>((resolve) => {
			enhancedResolve(process.cwd(), source, (error, result) => {
				resolve(error ?? (result as string));
			});
		});
		if (main instanceof Error) {
			throw main;
		}

		const contents = (await fs.readFile(main)).toString();

		for (const dependency of precinct(contents)) {
			filesToWatch.add(path.join(path.dirname(main), dependency));
		}
	}

	const onFileChange = debounce(async () => {
		await onChange().catch(onError);
	});

	await new Promise(() => {
		for (const file of filesToWatch) {
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			fsClassic.watchFile(file, onFileChange);
		}
	});
}
