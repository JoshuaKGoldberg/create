import { isLocalPath } from "./utils.js";

export function findPositionalFrom(positionals: string[]) {
	const indexOfDashes = positionals.findIndex((positional) =>
		positional.startsWith("--"),
	);
	const potentials =
		indexOfDashes === -1 ? positionals : positionals.slice(0, indexOfDashes);
	const from = potentials.at(potentials.length >= 2 ? 2 : -1);

	return from && !isLocalPath(from) && !from.startsWith("create-")
		? `create-${from}`
		: from;
}
