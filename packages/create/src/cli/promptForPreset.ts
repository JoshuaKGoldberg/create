import readline from "node:readline/promises";

export async function promptForPreset(
	labels: string[],
	specified: string | undefined,
) {
	let rl: readline.Interface | undefined;

	const allowed = new Map(labels.map((label) => [label.toLowerCase(), label]));
	let label = specified && allowed.get(specified.toLowerCase());

	while (!label) {
		rl ??= readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		// TODO: Eventually, it'd be nice to use Clack or similar...
		const answer = await rl.question(
			`Out of (${labels.join(", ")}), which preset would you like?\n`,
		);

		label = allowed.get(answer.toLowerCase());
	}

	rl?.close();

	return label;
}
