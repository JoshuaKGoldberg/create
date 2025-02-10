import { SystemRunner, TakeInput } from "bingo";
import { WritingFileSystem } from "bingo-fs";

export interface MockSystemOptions {
	fetch?: typeof fetch;
	fs?: Partial<WritingFileSystem>;
	runner?: SystemRunner;
	take?: TakeInput;
}
