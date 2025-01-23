import { isLocalPath } from "./utils.js";

export function findPositionalFrom(positionals: string[]) {
	console.log({ positionals });
	const from = positionals.find((positional) => !positional.startsWith("-"));

	return from && !isLocalPath(from) && !from.startsWith("create-")
		? `create-${from}`
		: from;
}
