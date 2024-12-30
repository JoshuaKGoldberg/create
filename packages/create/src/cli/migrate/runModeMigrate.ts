import * as prompts from "@clack/prompts";

import { tryImportConfig } from "../../config/tryImportConfig.js";
import { produceBase } from "../../producers/produceBase.js";
import { runPreset } from "../../runners/runPreset.js";
import { createSystemContextWithAuth } from "../../system/createSystemContextWithAuth.js";
import { createClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { ModeResults } from "../types.js";

export interface RunModeMigrateSettings {
	configFile: string | undefined;
	directory?: string;
}

export async function runModeMigrate({
	configFile,
	directory = ".",
}: RunModeMigrateSettings): Promise<ModeResults> {
	if (!configFile) {
		return {
			outro:
				"--mode migrate without a configFile is not yet implemented. Check back later! ❤️‍🔥",
			status: CLIStatus.Error,
		};
	}

	const config = await tryImportConfig(
		configFile,
		async (moduleName) => (await import(moduleName)) as object,
	);
	if (config instanceof Error) {
		return {
			outro: config.message,
			status: CLIStatus.Error,
		};
	}
	const description = `the ${config.preset.about.name} preset`;

	prompts.log.message(`Loaded ${description} from ${configFile}.`);

	const display = createClackDisplay();
	const system = await createSystemContextWithAuth({ directory, display });

	display.spinner.start(`Running ${description}...`);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const options = (await produceBase(config.preset.base, {
		...system,
		directory,
	}))!;

	await runPreset(config.preset, {
		...system,
		directory,
		mode: "migrate",
		options,
	});

	display.spinner.stop(`Ran ${description}.`);

	return {
		outro: `Applied ${description} to files on disk. You might want to commit any changes.`,
		status: CLIStatus.Success,
	};
}
