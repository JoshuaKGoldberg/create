import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { BlockPhase } from "../types/blocks.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { RunningContext } from "../types/running.js";
import { runCreation } from "./runCreation.js";

export async function runPreset<PresetOptionsShape extends AnyShape>(
	preset: Preset<PresetOptionsShape>,
	options: InferredObject<PresetOptionsShape>,
	context: RunningContext,
) {
	let created: Creation = {
		commands: [],
		documentation: {},
		editor: {},
		files: {},
		jobs: [],
		metadata: [],
		package: {},
	};

	const blocksSorted = preset.blocks.sort(
		(a, b) => (a.phase ?? BlockPhase.Default) - (b.phase ?? BlockPhase.Default),
	);

	for (const block of blocksSorted) {
		created = mergeCreations(
			created,
			await block.produce({
				...context,
				created,
				options,
			}),
		);
	}

	await runCreation(created, context);
}
