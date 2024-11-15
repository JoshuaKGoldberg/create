import { TakeContext } from "./context.js";
import { SystemRunner } from "./system.js";

export interface InputFileSystem {
	readFile: FileSystemReadFile;
}

export type FileSystemReadFile = (filePath: string) => Promise<string>;

export interface InputContext extends TakeContext {
	fetcher: typeof fetch;
	fs: InputFileSystem;
	runner: SystemRunner;
}

export interface InputContextWithArgs<Args> extends InputContext {
	args: Args;
}

export type Input<
	Result,
	Args extends object | undefined = undefined,
> = Args extends object
	? InputWithArgs<Result, Args>
	: InputWithoutArgs<Result>;

export type InputWithoutArgs<Result> = (context: InputContext) => Result;

export type InputWithArgs<Result, Args> = (
	context: InputContextWithArgs<Args>,
) => Result;

export interface TakeInput {
	<Result, Args extends object | undefined = undefined>(
		input: InputWithArgs<Result, Args>,
		args: Args,
	): Result;
	<Result>(input: InputWithoutArgs<Result>): Result;
}

export type InputArgsFor<TypeofInput> =
	TypeofInput extends Input<unknown, infer ArgsShape> ? ArgsShape : never;

export type InputContextFor<TypeofInput> =
	TypeofInput extends InputWithArgs<unknown, infer ArgsShape>
		? InputContextWithArgs<ArgsShape>
		: TypeofInput extends InputWithoutArgs<unknown>
			? InputContext
			: never;
