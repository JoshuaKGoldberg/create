import { isLocalPath } from "../utils.js";

export function findPositionalFrom(positionals: string[]) {
	// TODO: intelligently skip past node.js, etc.?
	const from = positionals.at(2);
	if (!from || isLocalPath(from) || from.startsWith("create-")) {
		return from;
	}

	return `create-${from}`;
}
