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
	SchemaDefinitionWithoutMetadata,
	SchemaWithMetadata,
	SchemaWithoutMetadata,
} from "../types/schemas.js";

export function createSchema<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
>(
	schemaDefinition: SchemaDefinition<MetadataShape, OptionsShape>,
): SchemaWithMetadata<MetadataShape, OptionsShape>;
export function createSchema<OptionsShape extends AnyShape>(
	schemaDefinition: SchemaDefinitionWithoutMetadata<OptionsShape>,
): SchemaWithoutMetadata<OptionsShape>;
export function createSchema<
	MetadataShape extends AnyShape,
	OptionsShape extends AnyShape,
>(
	schemaDefinition: SchemaDefinition<MetadataShape, OptionsShape>,
): Schema<MetadataShape, OptionsShape> {
	type Metadata = InferredObject<MetadataShape>;
	type Options = InferredObject<OptionsShape>;

	const createBlock = (<ArgsShape extends AnyShape | undefined>(
		blockDefinition: BlockDefinition<ArgsShape, Metadata, Options>,
	) => {
		return "args" in blockDefinition
			? createBlockWithArgs(blockDefinition)
			: createBlockWithoutArgs(blockDefinition);
	}) as CreateBlockFactory<Metadata, Options>;

	const createBlockWithoutArgs = (
		blockDefinition: BlockDefinitionWithoutArgs<Metadata, Options>,
	): BlockFactoryWithoutArgs<Metadata, Options> => {
		return () => ({
			about: blockDefinition.about,
			produce: blockDefinition.produce,
		});
	};

	const createBlockWithArgs = <ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Metadata, Options>,
	): BlockFactoryWithRequiredArgs<
		InferredObject<ArgsShape>,
		Metadata,
		Options
	> => {
		type Args = InferredObject<ArgsShape>;
		const argsSchema = z.object(blockDefinition.args);

		return (argsRaw: Args): BlockWithArgs<Args, Metadata, Options> => {
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
		createPreset: (
			presetDefinition: PresetDefinition<MetadataShape, OptionsShape>,
		) => ({ ...presetDefinition, schema }),
	};

	// @ts-expect-error -- TODO: I can't figure this out...
	return schema;
}
