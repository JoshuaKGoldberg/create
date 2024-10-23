import { CreatedDocumentation } from "../types/creations.js";

export function mergeDocumentation(
	first: Record<string, CreatedDocumentation | string> | undefined,
	second: Record<string, CreatedDocumentation | string> | undefined,
) {
	if (!first) {
		return second ?? {};
	}

	if (!second) {
		return first;
	}

	for (const i in first) {
		if (i in second && first[i] !== second[i]) {
			throw new Error(
				[
					`Conflicting documentation for "${i}":`,
					textForDocumentation(first[i]),
					"vs.",
					textForDocumentation(second[i]),
				].join(" "),
			);
		}
	}

	return {
		...first,
		...second,
	};
}

function textForDocumentation(docs: CreatedDocumentation | string) {
	return `"${typeof docs === "string" ? docs : docs.text}"`;
}
