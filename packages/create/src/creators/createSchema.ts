import { z } from "zod";

import { BlockPhase } from "../enums.js";
import { AnyShape, InferredObject, InputShape } from "../options.js";
import {
	BlockDefinition,
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
} from "../types/blocks.js";
import { Schema, SchemaDefinition } from "../types/schemas.js";

export const createSchema = <OptionsShape extends AnyShape>(
	schemaDefinition: SchemaDefinition<OptionsShape>,
): Schema<OptionsShape> => {
	type Options = InferredObject<OptionsShape>;
	const createBlock = <ArgsShape extends AnyShape | undefined>(
		blockDefinition: BlockDefinition<InferredObject<OptionsShape>, ArgsShape>,
	) => {
		return "args" in blockDefinition
			? createBlockWithArgs(blockDefinition)
			: createBlockWithoutArgs(blockDefinition);
	};

	const createBlockWithoutArgs = (
		blockDefinition: BlockDefinitionWithoutArgs<Options>,
	): BlockFactoryWithoutArgs<InferredObject<OptionsShape>> => {
		return () => ({
			about: blockDefinition.about,
			phase: blockDefinition.phase ?? BlockPhase.Default,
			produce: async (context) => {
				return await blockDefinition.produce(context);
			},
		});
	};

	const createBlockWithArgs = <ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<Options, ArgsShape>,
	): BlockFactoryWithOptionalArgs<InferredObject<OptionsShape>, ArgsShape> => {
		type Args = InferredObject<ArgsShape>;
		const argsSchema = z.object(blockDefinition.args);

		return (args: Partial<InputShape<ArgsShape>> | undefined = {}) => {
			return {
				about: blockDefinition.about,
				phase: blockDefinition.phase ?? BlockPhase.Default,
				produce: async (context) => {
					return await blockDefinition.produce({
						...context,
						args: argsSchema.parse(args) as Args,
					});
				},
			};
		};
	};

	const schema: Schema<OptionsShape> = {
		createBlock,
		createPreset: (presetDefinition) => ({ ...presetDefinition, schema }),
		options: schemaDefinition.options,
		produce: schemaDefinition.produce,
	};

	return schema;
};
