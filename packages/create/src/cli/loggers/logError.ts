import * as prompts from "@clack/prompts";

export function logError(message: string, error: unknown) {
	prompts.log.error(message);

	// TODO: Put in a log file?
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	prompts.log.info(`${error}`);
}
