import { ClackDisplay } from "../display/createClackDisplay.js";
import { onSourcesChange } from "./onSourcesChange.js";

export async function watchSources(
	display: ClackDisplay,
	onChange: () => Promise<void>,
	sources: string[],
) {
	const message = `watching ${sources.join(", ")} for changes...`;
	display.spinner.start(`Started ${message}`);

	await onSourcesChange(
		async () => {
			display.spinner.stop("Detected change");
			display.spinner.start("Re-running...");

			// First wait an arbitrary, small amount of time for files to settle
			await new Promise((resolve) => setTimeout(resolve, 50));

			await onChange();

			display.spinner.stop("Re-ran.");
			display.spinner.start(`Resumed ${message}`);
		},
		(error) => {
			display.spinner.stop(
				error instanceof Error ? error.message : String(error),
			);
		},
		sources,
	);
}
