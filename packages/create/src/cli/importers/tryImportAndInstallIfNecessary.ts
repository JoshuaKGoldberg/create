import { importLocalOrNpx } from "import-local-or-npx";

import { isLocalPath } from "../utils.js";

export async function tryImportAndInstallIfNecessary(
	from: string,
): Promise<Error | object> {
	const imported = await importLocalOrNpx(from, {
		// We ignore logs because we don't want to clutter CLI output
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		logger: () => {},
	});

	if (imported.kind === "failure") {
		return isLocalPath(from) ? imported.local : imported.npx;
	}

	return imported.resolved;
}
