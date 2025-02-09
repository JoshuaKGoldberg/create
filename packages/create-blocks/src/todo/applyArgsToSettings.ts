export function applyArgsToSettings<OptionsShape extends AnyShape>(
	args: string[],
	preset: Preset<OptionsShape>,
	settings: CreatedConfigSettings<InferredObject<OptionsShape>> = {},
): Error | typeof settings {
	const blocks = settings.blocks ?? {};
	const remove = new Set(blocks.exclude);
	const presetBlocks = new Map(
		preset.blocks
			.filter((block) => block.about?.name)
			.map((block) => [
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				slugify(block.about!.name),
				block,
			]),
	);

	for (const arg of args) {
		const match = /--exclude-(\w+)/.exec(arg);
		if (!match?.[1]) {
			continue;
		}

		const removedBlock = presetBlocks.get(match[1]);
		if (!removedBlock) {
			return new Error(
				`Block exclusion doesn't match any preset block: '${arg}'.`,
			);
		}

		remove.add(removedBlock);
	}

	return remove.size
		? {
				...settings,
				blocks: {
					...blocks,
					exclude: Array.from(remove),
				},
			}
		: settings;
}
