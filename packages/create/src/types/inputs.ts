import {
	CreationContextWithOptions,
	CreationContextWithoutOptions,
} from "./context";

export type Input<
	Result,
	Options extends object | undefined = undefined,
> = Options extends object
	? InputWithOptions<Result, Options>
	: InputWithoutOptions<Result>;

export type InputWithoutOptions<Result> = (
	context: CreationContextWithoutOptions,
) => Result;

export type InputWithOptions<Result, Options> = (
	context: CreationContextWithOptions<Options>,
) => Result;

export type TakeInput = <
	Result,
	Options extends object | undefined = undefined,
>(
	input: Input<Result, Options>,
	options: Options,
) => Result;
