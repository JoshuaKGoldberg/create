import { isLocalPath } from "../utils.js";

export function findPositionalFrom(positionals: string[]) {
	const from = positionals.at(2);

	return from && !isLocalPath(from) && !from.startsWith("create-")
		? `create-${from}`
		: from;
}
