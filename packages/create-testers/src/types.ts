import { SystemRunner, TakeInput } from "create";
import { WritingFileSystem } from "create-fs";

export interface MockSystemOptions {
	fetch?: typeof fetch;
	fs?: Partial<WritingFileSystem>;
	runner?: SystemRunner;
	take?: TakeInput;
}
