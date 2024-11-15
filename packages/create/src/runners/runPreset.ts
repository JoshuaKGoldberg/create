import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";

export function runPreset<OptionsShape extends AnyShape>(
	preset: Preset<OptionsShape>,
	options: InferredObject<OptionsShape>,
	context: SystemContext,
) {
	let created: Creation<InferredObject<OptionsShape>> = {
		addons: [],
		commands: [],
		files: {},
	};

	// TODO (BIG TODO): Implement the continuous merging algorithm!

	for (const block of preset.blocks) {
		created = mergeCreations(
			created,
			block.produce({
				...context,
				created,
				options,
			}),
		);
	}

	return created;
}
