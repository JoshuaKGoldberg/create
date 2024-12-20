import * as prompts from "@clack/prompts";
import enhancedResolve from "enhanced-resolve";
import { $ } from "execa";
import tmp from "tmp-promise";

import { isLocalPath } from "../utils.js";
import { tryImport } from "./tryImport.js";

export async function tryImportFrom(from: string) {
	const initialImport = await tryImport(from);
	if (!(initialImport instanceof Error)) {
		return initialImport;
	}

	if (isLocalPath(from[0])) {
		const hardcodedImport = await importFrom(process.cwd(), from);
		if (!(hardcodedImport instanceof Error)) {
			return hardcodedImport;
		}
	}

	let temporaryDirectory!: Error | string;

	await prompts.tasks([
		{
			task: async () => {
				const directory = await tmp.dir();
				const installation = await $({
					cwd: directory.path,
				})`npm install ${from}`;

				if (installation.exitCode) {
					temporaryDirectory = new Error(installation.stderr);
					return installation.stderr;
				}

				temporaryDirectory = directory.path;

				return `Retrieved ${from}`;
			},
			title: `Retrieving ${from}`,
		},
	]);

	if (temporaryDirectory instanceof Error) {
		return temporaryDirectory;
	}

	return await importFrom(temporaryDirectory, from);
}

async function importFrom(directory: string, packageName: string) {
	const main = await new Promise<Error | string>((resolve) => {
		enhancedResolve(directory, packageName, (error, result) => {
			resolve(error ?? (result as string));
		});
	});

	return typeof main === "string" ? ((await import(main)) as object) : main;
}
