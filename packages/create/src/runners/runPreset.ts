import { mergeCreations } from "../mergers/mergeCreations.js";
import { AnyShape, InferredObject } from "../options.js";
import { Creation } from "../types/creations.js";
import { Preset } from "../types/presets.js";
import { SystemContext } from "../types/system.js";

export function runPreset<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
>(
	preset: Preset<MetadataShape, OptionsShape>,
	options: InferredObject<OptionsShape>,
	context: SystemContext,
) {
	type Metadata = InferredObject<MetadataShape>;
	type Options = InferredObject<OptionsShape>;

	let created: Creation<Metadata, Options> = {
		addons: [],
		commands: [],
		files: {},
		// TODO: Hook up constraints to not need assertion...
		// ...or, rather, make sure schemas have a starting metadata object?
		metadata: {} as Metadata,
	};

	// @ts-expect-error -- TODO: Remove phase altogether, I hope?
	const blocksSorted = preset.blocks.sort((a, b) => a.phase - b.phase);

	for (const block of blocksSorted) {
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
