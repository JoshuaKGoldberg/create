import { AnyShape, InferredObject, InputShape } from "../options.js";
import { PromiseOrSync } from "../utils.js";
import { AboutBase } from "./about.js";
import { Creation, IndirectCreation } from "./creations.js";

export enum BlockPhase {
	Default = 0,
	Install,
	Source,
	Test,
	Build,
	Format,
	Lint,
	Package,
	Documentation,
	Git,
	Editor,
	CI,
}

export interface BlockDefinitionBase {
	about?: AboutBase;
	phase?: BlockPhase;
}

export type BlockDefinition<
	Options extends object,
	ArgsShape extends AnyShape | undefined,
> = ArgsShape extends object
	? BlockDefinitionWithArgs<Options, ArgsShape>
	: BlockDefinitionWithoutArgs<Options>;

export interface BlockDefinitionWithArgs<
	Options extends object,
	ArgsShape extends AnyShape,
> extends BlockDefinitionBase {
	args: ArgsShape;
	produce: BlockProducerWithArgs<Options, InferredObject<ArgsShape>>;
}

export interface BlockDefinitionWithoutArgs<Options extends object>
	extends BlockDefinitionBase {
	produce: BlockProducerWithoutArgs<Options>;
}

export interface BlockContext<Options extends object> {
	/**
	 * @todo It would be nice to not provide this to blocks without an explicit phase.
	 */
	created: IndirectCreation;
	options: Options;
}

export type BlockProducerWithArgs<
	Options extends object,
	Args extends object,
> = (
	context: ContextWithArgs<Options, Args>,
) => PromiseOrSync<Partial<Creation>>;

export type BlockProducerWithoutArgs<Options extends object> = (
	context: BlockContext<Options>,
) => PromiseOrSync<Partial<Creation>>;

export interface ContextWithArgs<Options extends object, Args extends object>
	extends BlockContext<Options> {
	args: Args;
}

export type BlockFactory<
	Options extends object,
	ArgsShape extends AnyShape | undefined,
> = ArgsShape extends object
	? BlockFactoryWithRequiredArgs<Options, InputShape<ArgsShape>>
	: BlockFactoryWithoutArgs<Options>;

export type BlockFactoryWithRequiredArgs<
	Options extends object,
	Args extends object,
> = (args: Args) => Block<Options>;

export type BlockFactoryWithOptionalArgs<
	Options extends object,
	Args extends object,
> = (args?: Args) => Block<Options>;

export type BlockFactoryWithoutArgs<Options extends object> =
	() => Block<Options>;

export interface Block<Options extends object> {
	about?: AboutBase;
	phase?: BlockPhase;
	produce: (context: BlockContext<Options>) => Promise<Partial<Creation>>;
}
