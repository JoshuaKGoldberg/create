import { SystemRunner, TakeInput, WritingFileSystem } from "create";

export interface MockSystemOptions {
	fetcher?: typeof fetch;
	fs?: Partial<WritingFileSystem>;
	runner?: SystemRunner;
	take?: TakeInput;
}
