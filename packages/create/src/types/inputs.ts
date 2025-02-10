import { ReadingFileSystem } from "create-fs";

import { TakeContext } from "./context.js";
import { SystemFetchers, SystemRunner } from "./system.js";

export type Input<
	Result,
	Args extends object | undefined = undefined,
> = Args extends object
	? InputWithArgs<Result, Args>
	: InputWithoutArgs<Result>;

export type InputArgsFor<TypeofInput> =
	TypeofInput extends Input<unknown, infer ArgsShape> ? ArgsShape : never;

export interface InputContext extends TakeContext {
	fetchers: SystemFetchers;
	fs: ReadingFileSystem;
	offline?: boolean;
	runner: SystemRunner;
}

export type InputContextFor<TypeofInput> =
	TypeofInput extends InputWithArgs<unknown, infer ArgsShape>
		? InputContextWithArgs<ArgsShape>
		: TypeofInput extends InputWithoutArgs<unknown>
			? InputContext
			: never;

export interface InputContextWithArgs<Args extends object>
	extends InputContext {
	args: Args;
}

export interface InputContextWithArgs<Args extends object>
	extends InputContext {
	args: Args;
}

export type InputWithArgs<Result, Args extends object> = (
	context: InputContextWithArgs<Args>,
) => Result;

export type InputWithoutArgs<Result> = (context: InputContext) => Result;

export interface TakeInput {
	<Result, Args extends object>(
		input: InputWithArgs<Result, Args>,
		args: Args,
	): Result;
	<Result>(input: InputWithoutArgs<Result>): Result;
}
