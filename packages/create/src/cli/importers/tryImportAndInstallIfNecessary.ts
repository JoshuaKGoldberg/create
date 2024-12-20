import * as prompts from "@clack/prompts";
import enhancedResolve from "enhanced-resolve";
import { $ } from "execa";
import path from "node:path";
import tmp from "tmp-promise";

import { isLocalPath } from "../utils.js";
import { tryImport } from "./tryImport.js";
import { tryRequire } from "./tryRequire.js";

// TODO: Split this out into its own module?
export async function tryImportAndInstallIfNecessary(
	from: string,
): Promise<Error | object> {
	const spinner = prompts.spinner();
	spinner.start(`Retrieving ${from}`);

	const initialImport = await tryImport(from);
	if (!(initialImport instanceof Error)) {
		spinner.stop(labelFrom(from));
		return initialImport;
	}

	if (isLocalPath(from[0])) {
		const hardcodedImport = await importFrom(process.cwd(), from);
		if (!(hardcodedImport instanceof Error)) {
			spinner.stop(labelFrom(from));
			return hardcodedImport;
		}
	}

	const directory = await tmp.dir();
	const installation = await $({
		cwd: directory.path,
	})`npm install ${from}`;

	if (installation.exitCode) {
		// TODO: better messaging?
		spinner.stop(installation.stderr);
		return new Error(installation.stderr);
	}

	const importedFrom = await importFrom(directory.path, from);

	if (importedFrom instanceof Error) {
		// TODO: better messaging?
		spinner.stop(importedFrom.message);
		return importedFrom;
	}

	spinner.stop(labelFrom(from, path.join(directory.path, "node_modules")));

	return importedFrom;
}

async function importFrom(directory: string, packageName: string) {
	const main = await new Promise<Error | string>((resolve) => {
		enhancedResolve(directory, packageName, (error, result) => {
			resolve(error ?? (result as string));
		});
	});

	return typeof main === "string" ? ((await import(main)) as object) : main;
}

function labelFrom(from: string, temporaryDirectory?: string) {
	if (!temporaryDirectory) {
		return `Imported ${from}`;
	}

	const packageData = tryRequire(
		path.join(temporaryDirectory, from, "package.json"),
	);

	const version =
		packageData &&
		typeof packageData === "object" &&
		"version" in packageData &&
		typeof packageData.version === "string"
			? `@${packageData.version}`
			: "";

	return `Imported ${from}${version} from a temporary installation`;
}
