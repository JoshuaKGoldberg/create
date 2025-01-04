import { AnyOptionalShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { CreatedBlockAddons, Creation, DirectCreation } from "./creations.js";

export type Block<
	Addons extends object | undefined = object | undefined,
	Options extends object = object,
> = Addons extends object
	? BlockWithAddons<Addons, Options>
	: BlockWithoutAddons<Options>;

export type BlockAugmentWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<DirectCreation>;

export type BlockAugmentWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<DirectCreation>;

export interface BlockBase {
	about?: AboutBase;
}

export interface BlockContextWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons: Addons;
	options: Options;
}

export interface BlockContextWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons?: Addons;
	options: Options;
}

export interface BlockContextWithoutAddons<Options extends object> {
	offline?: boolean;
	options: Options;
}

export type BlockDefinition<
	AddonsShape extends AnyOptionalShape | undefined,
	Options extends object,
> = AddonsShape extends object
	? BlockDefinitionWithAddons<AddonsShape, Options>
	: BlockDefinitionWithoutAddons<Options>;

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export type BlockDefinitionProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<Creation<Options>>;

export type BlockDefinitionProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<Creation<Options>>;

export interface BlockDefinitionWithAddons<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
> extends BlockDefinitionBase {
	addons: AddonsShape;
	initialize?: BlockAugmentWithAddons<InferredObject<AddonsShape>, Options>;
	migrate?: BlockAugmentWithAddons<InferredObject<AddonsShape>, Options>;
	produce: BlockDefinitionProducerWithAddons<
		InferredObject<AddonsShape>,
		Options
	>;
}

export interface BlockDefinitionWithoutAddons<Options extends object>
	extends BlockDefinitionBase {
	initialize?: BlockAugmentWithoutAddons<Options>;
	migrate?: BlockAugmentWithoutAddons<Options>;
	produce: BlockDefinitionProducerWithoutAddons<Options>;
}

export type BlockProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<Creation<Options>>;

export type BlockProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<Creation<Options>>;

export interface BlockWithAddons<Addons extends object, Options extends object>
	extends BlockBase {
	initialize?: BlockAugmentWithAddons<Addons, Options>;
	migrate?: BlockAugmentWithAddons<Addons, Options>;
	produce: BlockProducerWithAddons<Addons, Options>;
	(addons: Partial<Addons>): CreatedBlockAddons<Addons, Options>;
}

export interface BlockWithoutAddons<Options extends object> extends BlockBase {
	initialize?: BlockAugmentWithoutAddons<Options>;
	migrate?: BlockAugmentWithoutAddons<Options>;
	produce: BlockProducerWithoutAddons<Options>;
}
