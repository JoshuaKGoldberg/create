import { ClackDisplay } from "./createClackDisplay.js";

export async function runSpinnerTask<T>(
	display: ClackDisplay,
	start: string,
	stop: string,
	task: () => Promise<T>,
) {
	display.spinner.start(`${start}...`);

	const result = await task();

	display.spinner.stop(`${stop}.`);

	return result;
}
