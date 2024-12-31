import { SystemContext } from "../../types/system.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { runWatchIteration } from "./runWatchIteration.js";
import { watchSources } from "./watchSources.js";

export interface WatchModeSettings {
	configFile?: string;
	directory: string;
	display: ClackDisplay;
	from?: string;
	options: object;
	preset?: string | undefined;
	system: SystemContext;
}
export async function startWatchMode({
	configFile,
	directory,
	display,
	from,
	options,
	preset,
	system,
}: WatchModeSettings) {
	if (!configFile && !from) {
		return {
			outro:
				"Cannot enter --watch mode without either a config file or a relative --from.",
			status: CLIStatus.Error,
		};
	}

	await watchSources(
		display,
		async () => {
			await runWatchIteration({
				directory,
				load: {
					configFile,
					directory,
					from,
					requestedPreset: preset,
				},
				options,
				system,
			});
		},
		[configFile, from].filter((file) => typeof file === "string"),
	);

	return {
		outro: "Watch mode closed.",
		status: CLIStatus.Success,
	};
}
