import { z } from "zod";

import { AnyShape, InferredObject } from "../options.js";
import {
	BlockDefinition,
	BlockDefinitionWithArgs,
	BlockDefinitionWithoutArgs,
	BlockFactoryWithOptionalArgs,
	BlockFactoryWithoutArgs,
	BlockWithOptionalArgs,
} from "../types/blocks.js";
import { CreateBlockFactory, Base, BaseDefinition } from "../types/bases.js";
import { PresetDefinition } from "../types/presets.js";

export function createBase<OptionsShape extends AnyShape>(
	baseDefinition: BaseDefinition<OptionsShape>,
): Base<OptionsShape> {
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
		return function factory() {
			return {
				about: blockDefinition.about,
				factory,
				produce: blockDefinition.produce,
			};
		};
	};

	const createBlockWithArgs = <ArgsShape extends AnyShape>(
		blockDefinition: BlockDefinitionWithArgs<ArgsShape, Options>,
	): BlockFactoryWithOptionalArgs<InferredObject<ArgsShape>, Options> => {
		type Args = InferredObject<ArgsShape>;
		const argsSchema = z.object(blockDefinition.args);

		return function factory(
			argsRaw?: Args,
		): BlockWithOptionalArgs<Args, Options> {
			const argsParsed = argsSchema.parse(argsRaw ?? {}) as Args;
			return {
				about: blockDefinition.about,
				args: argsParsed,
				factory,
				produce: (context) => {
					return blockDefinition.produce({
						...context,
						args: argsParsed,
					});
				},
			};
		};
	};

	const base = {
		...baseDefinition,
		createBlock,
		createPreset: (presetDefinition: PresetDefinition<OptionsShape>) => ({
			...presetDefinition,
			base,
		}),
	};

	// @ts-expect-error -- TODO: I can't figure this out...
	return base;
}
