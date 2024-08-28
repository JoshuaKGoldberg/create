import { mergeCreations } from "../mergers/mergeCreations";
import { AnyOptionsSchema, InferredSchema } from "../options";
import { CreationContextWithoutOptions } from "../types/context";
import { Creation, CreationFirstRound } from "../types/creations";
import { Preset } from "../types/presets";
import { runCreation } from "./runCreation";

export async function runPreset<PresetOptionsSchema extends AnyOptionsSchema>(
	preset: Preset<PresetOptionsSchema>,
	options: InferredSchema<PresetOptionsSchema>,
	context: CreationContextWithoutOptions,
) {
	// From docs/running/about.md ...

	// 2. Run blocks in order with their portions of the context
	const starting = await preset({ ...context, options });
	const startingCreation = mergeCreations(starting.map(removeFunctionValues));

	// 3. Run delayed portions of blocks that required metadata, in order
	const creations = starting.map((firstRound) =>
		firstRoundToCreation(firstRound, startingCreation),
	);
	const creation = mergeCreations(creations);

	// 4. Run all stored file, network, and shell operations
	await runCreation(creation, context);
}

function removeFunctionValues(firstRound: CreationFirstRound): Creation {
	return Object.fromEntries(
		Object.entries(firstRound).filter(
			([, value]) => typeof value !== "function",
		),
	);
}

function firstRoundToCreation(
	firstRound: CreationFirstRound,
	firstRoundsCreation: Creation,
): Creation {
	return Object.fromEntries(
		Object.entries(firstRound).map(([key, value]) => [
			key,
			typeof value === "function" ? value(firstRoundsCreation) : value,
		]),
	);
}
