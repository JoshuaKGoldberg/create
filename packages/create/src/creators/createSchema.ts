import { z } from "zod";

import { AnyShape, InferredObject, InputShape } from "../options.js";
import {
	BlockDefinition,
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockPhase,
} from "../types/blocks.js";
import {
	CreateBlockFactory,
	Schema,
	SchemaDefinition,
} from "../types/schemas.js";

function isBlockDefinitionWithArgs<
	Options extends object,
	ArgsShape extends AnyShape,
>(
	definition:
		| BlockDefinitionWithArgs<Options, ArgsShape>
		| BlockDefinitionWithoutArgs<Options>,
): definition is BlockDefinitionWithArgs<Options, ArgsShape> {
	return "args" in definition;
}

export const createSchema = <OptionsShape extends AnyShape>(
	schemaDefinition: SchemaDefinition<OptionsShape>,
): Schema<OptionsShape> => {
	type Options = InferredObject<OptionsShape>;
	const createBlock = <ArgsShape extends AnyShape | undefined>(
		blockDefinition: BlockDefinition<InferredObject<OptionsShape>, ArgsShape>,
	) => {
		return isBlockDefinitionWithArgs(blockDefinition)
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
		createBlock: createBlock as CreateBlockFactory<OptionsShape>,
		createPreset: (preset) => ({ ...preset, schema }),
		options: schemaDefinition.options,
		produce: schemaDefinition.produce,
	};

	return schema;
};
