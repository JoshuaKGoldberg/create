import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";

export async function runPreset<PresetOptionsShape extends AnyShape>(
	preset: Preset<PresetOptionsShape>,
	options: InferredObject<PresetOptionsShape>,
	context: SystemContext,
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

	const blocksSorted = preset.blocks.sort((a, b) => a.phase - b.phase);

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

	return created;
}
