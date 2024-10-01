import { ContextBase } from "./context.js";
import { SystemRunner } from "./system.js";

export interface InputFileSystem {
	readFile: FileSystemReadFile;
}

export type FileSystemReadFile = (filePath: string) => Promise<string>;

export interface InputContext extends ContextBase {
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

export type TakeInput = <Result, Args extends object | undefined = undefined>(
	input: Input<Result, Args>,
	args: Args,
) => Result;
