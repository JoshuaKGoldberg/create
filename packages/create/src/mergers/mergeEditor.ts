import { CreatedEditor } from "../types/creations.js";
import { mergeArrays } from "./mergeArrays.js";
import { removeEmptyEntries } from "./removeEmptyEntries.js";

export function mergeEditor(
	first: CreatedEditor,
	second: CreatedEditor | undefined,
) {
	if (!second) {
		return first;
	}

	return removeEmptyEntries({
		debuggers: mergeArrays(first.debuggers, second.debuggers),
		settings: {
			...first.settings,
			...second.settings,
		},
		tasks: mergeArrays(first.tasks, second.tasks),
	});
}
