import { z } from "zod";

import { AnyShape, InferredObject } from "../options.js";
import {
	BlockDefinition,
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockFactoryWithoutArgs,
	BlockFactoryWithRequiredArgs,
	BlockWithArgs,
} from "../types/blocks.js";
import { PresetDefinition } from "../types/presets.js";
import {
	CreateBlockFactory,
	Schema,
	SchemaDefinition,
} from "../types/schemas.js";

export function createSchema<OptionsShape extends AnyShape>(
	schemaDefinition: SchemaDefinition<OptionsShape>,
): Schema<OptionsShape> {
	type Options = InferredObject<OptionsShape>;

	const createBlock = (<ArgsShape extends AnyShape | undefined>(
		blockDefinition: BlockDefinition<ArgsShape, Options>,
	) => {
		return "args" in blockDefinition
			? createBlockWithArgs(blockDefinition)
			: createBlockWithoutArgs(blockDefinition);
	}) as CreateBlockFactory<Options>;

	const createBlockWithoutArgs = (
		blockDefinition: BlockDefinitionWithoutArgs<Options>,
	): BlockFactoryWithoutArgs<Options> => {
		return () => ({
			about: blockDefinition.about,
			produce: blockDefinition.produce,
		});
	};

	const createBlockWithArgs = <ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockFactoryWithRequiredArgs<InferredObject<ArgsShape>, Options> => {
		type Args = InferredObject<ArgsShape>;
		const argsSchema = z.object(blockDefinition.args);

		return (argsRaw: Args): BlockWithArgs<Args, Options> => {
			const argsParsed = argsSchema.parse(argsRaw) as Args;
			return {
				about: blockDefinition.about,
				args: argsParsed,
				produce: (context) => {
					return blockDefinition.produce({
						...context,
						args: argsParsed,
					});
				},
			};
		};
	};

	const schema = {
		...schemaDefinition,
		createBlock,
		createPreset: (presetDefinition: PresetDefinition<OptionsShape>) => ({
			...presetDefinition,
			schema,
		}),
	};

	// @ts-expect-error -- TODO: I can't figure this out...
	return schema;
}
