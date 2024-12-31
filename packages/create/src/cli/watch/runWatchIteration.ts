import * as prompts from "@clack/prompts";
import { importLocalOrNpx } from "import-local-or-npx";
import path from "node:path";

import { tryImportConfig } from "../../config/tryImportConfig.js";
import { isTemplate } from "../../predicates/isTemplate.js";
import { runPreset } from "../../runners/runPreset.js";
import { SystemContext } from "../../types/system.js";
import { getRequestedPreset } from "../getRequestedPreset.js";
import { MigrationLoadSettings } from "../migrate/tryLoadMigrationPreset.js";
import { tryImportWithPredicate } from "../tryImportWithPredicate.js";
import { isLocalPath } from "../utils.js";

export interface RunWatchIterationSettings {
	directory: string;
	load: MigrationLoadSettings;
	options: object;
	system: SystemContext;
}

export async function runWatchIteration({
	directory,
	load,
	options,
	system,
}: RunWatchIterationSettings) {
	const query = `?now=${performance.now().toString()}`;
	const loaded = load.configFile
		? await tryImportConfig(
				path.join(process.cwd(), directory, `${load.configFile}${query}`),
			)
		: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await loadTemplateFrom(`${load.from!}${query}`, load.requestedPreset!);

	if (loaded instanceof Error || prompts.isCancel(loaded)) {
		return loaded;
	}

	await runPreset(loaded.preset, {
		...system,
		...loaded.settings,
		directory,
		mode: "migrate",
		options,
	});
}

async function loadTemplateFrom(from: string, requestedPreset: string) {
	const template = await tryImportWithPredicate(
		async (moduleName: string) => {
			const imported = await importLocalOrNpx(moduleName, {
				// We ignore logs because we don't want to clutter CLI output
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				logger: () => {},
			});
			return imported.kind === "failure"
				? isLocalPath(from)
					? imported.local
					: imported.npx
				: imported.resolved;
		},
		from,
		isTemplate,
		"Template",
	);
	if (template instanceof Error) {
		return template;
	}

	const preset = getRequestedPreset(requestedPreset, template);
	if (preset instanceof Error) {
		return preset;
	}

	return { preset, settings: {}, template };
}
