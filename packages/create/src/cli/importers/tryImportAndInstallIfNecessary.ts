import * as prompts from "@clack/prompts";
import { importLocalOrNpx } from "import-local-or-npx";

import { isLocalPath } from "../utils.js";

export async function tryImportAndInstallIfNecessary(
	from: string,
): Promise<Error | object> {
	const spinner = prompts.spinner();
	spinner.start(`Retrieving ${from}`);

	const imported = await importLocalOrNpx(from);

	if (imported.kind === "failure") {
		spinner.stop(`Could not retrieve ${from}`);
		return isLocalPath(from) ? imported.local : imported.npx;
	}

	spinner.stop(`Retrieved ${from}`);

	return imported.resolved;
}
