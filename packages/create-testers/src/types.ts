import { SystemRunner, TakeInput, WritingFileSystem } from "create";

export interface MockSystemOptions {
	fetch?: typeof fetch;
	fs?: Partial<WritingFileSystem>;
	runner?: SystemRunner;
	take?: TakeInput;
}
