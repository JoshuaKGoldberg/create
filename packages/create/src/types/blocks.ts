import { AnyOptionalShape, InferredObject } from "../options.js";
import { AboutBase } from "./about.js";
import { CreatedBlockAddons, Creation } from "./creations.js";

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export interface BlockDefinitionWithoutAddons<Options extends object>
	extends BlockDefinitionBase {
	produce: BlockDefinitionProducerWithoutAddons<Options>;
}

export interface BlockDefinitionWithAddons<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
> extends BlockDefinitionBase {
	addons: AddonsShape;
	produce: BlockDefinitionProducerWithAddons<
		InferredObject<AddonsShape>,
		Options
	>;
}

export type BlockDefinition<
	AddonsShape extends AnyOptionalShape | undefined,
	Options extends object,
> = AddonsShape extends object
	? BlockDefinitionWithAddons<AddonsShape, Options>
	: BlockDefinitionWithoutAddons<Options>;

export type BlockDefinitionProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<Creation<Options>>;

export type BlockDefinitionProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<Creation<Options>>;

export interface BlockContextWithoutAddons<Options extends object> {
	options: Options;
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

export interface BlockBase {
	about?: AboutBase;
}

export interface BlockWithoutAddons<Options extends object> extends BlockBase {
	produce: BlockProducerWithoutAddons<Options>;
}

export interface BlockWithAddons<Addons extends object, Options extends object>
	extends BlockBase {
	produce: BlockProducerWithAddons<Addons, Options>;
	(addons: Partial<Addons>): CreatedBlockAddons<Addons, Options>;
}

export type Block<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? BlockWithAddons<Addons, Options>
	: BlockWithoutAddons<Options>;

export type BlockProducerWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<Creation<Options>>;

export type BlockProducerWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<Creation<Options>>;
