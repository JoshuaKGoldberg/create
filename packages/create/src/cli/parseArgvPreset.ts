import { parseArgs } from "node:util";

export function parseArgsPreset(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			preset: {
				type: "string",
			},
		},
	});

	return values.preset;
}
