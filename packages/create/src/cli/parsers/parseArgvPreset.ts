import { parseArgs } from "node:util";

export function parseArgsPreset(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			preset: {
				type: "string",
			},
		},
		strict: false,
	});

	return values.preset as string | undefined;
}
