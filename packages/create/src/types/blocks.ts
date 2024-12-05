import { AnyOptionalShape, InferredObject } from "../options.js";
import { PromiseOrSync } from "../utils/promises.js";
import { AboutBase } from "./about.js";
import { CreatedBlockAddons, Creation, DirectCreation } from "./creations.js";

export interface BlockDefinitionBase {
	about?: AboutBase;
}

export interface BlockDefinitionWithoutAddons<Options extends object>
	extends BlockDefinitionBase {
	build: BlockDefinitionBuildWithoutAddons<Options>;
	finalize?: BlockDefinitionFinalizeWithoutAddons<Options>;
}

export interface BlockDefinitionWithAddons<
	AddonsShape extends AnyOptionalShape,
	Options extends object,
> extends BlockDefinitionBase {
	addons: AddonsShape;
	build: BlockDefinitionBuildWithAddons<InferredObject<AddonsShape>, Options>;
	finalize?: BlockDefinitionFinalizeWithAddons<
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

export type BlockDefinitionBuildWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<Creation<Options>>;

export type BlockDefinitionFinalizeWithoutAddons<Options extends object> = (
	context: FinalizationContextWithoutAddons<Options>,
) => PromiseOrSync<Partial<DirectCreation>>;

export type BlockDefinitionBuildWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<Creation<Options>>;

export type BlockDefinitionFinalizeWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: FinalizationContextWithAddons<Addons, Options>,
) => PromiseOrSync<Partial<DirectCreation>>;

export interface BlockContextWithoutAddons<Options extends object> {
	options: Options;
}

export interface FinalizationContextWithoutAddons<Options extends object>
	extends BlockContextWithoutAddons<Options> {
	created: DirectCreation;
}

export interface BlockContextWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons: Addons;
	options: Options;
}

export interface FinalizationContextWithAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithAddons<Addons, Options> {
	created: DirectCreation;
}

export interface BlockContextWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithoutAddons<Options> {
	addons?: Addons;
	options: Options;
}

export interface FinalizationContextWithOptionalAddons<
	Addons extends object,
	Options extends object,
> extends BlockContextWithOptionalAddons<Addons, Options> {
	created: DirectCreation;
}

export interface BlockBase {
	about?: AboutBase;
}

export interface BlockWithoutAddons<Options extends object> extends BlockBase {
	build: BlockBuildWithoutAddons<Options>;
	finalize?: BlockFinalizeWithoutAddons<Options>;
}

export interface BlockWithAddons<Addons extends object, Options extends object>
	extends BlockBase {
	build: BlockBuildWithAddons<Addons, Options>;
	finalize?: BlockFinalizeWithAddons<Addons, Options>;
	(addons: Partial<Addons>): CreatedBlockAddons<Addons, Options>;
}

export type Block<
	Addons extends object | undefined,
	Options extends object,
> = Addons extends object
	? BlockWithAddons<Addons, Options>
	: BlockWithoutAddons<Options>;

export type BlockBuildWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: BlockContextWithAddons<Addons, Options>,
) => Partial<Creation<Options>>;

export type BlockFinalizeWithAddons<
	Addons extends object,
	Options extends object,
> = (
	context: FinalizationContextWithAddons<Addons, Options>,
) => PromiseOrSync<Partial<DirectCreation>>;

export type BlockBuildWithoutAddons<Options extends object> = (
	context: BlockContextWithoutAddons<Options>,
) => Partial<Creation<Options>>;

export type BlockFinalizeWithoutAddons<Options extends object> = (
	context: FinalizationContextWithoutAddons<Options>,
) => PromiseOrSync<Partial<DirectCreation>>;
