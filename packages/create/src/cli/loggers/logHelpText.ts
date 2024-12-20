import { Logger } from "../types.js";

export function logHelpText(logger: Logger) {
	logger.log("Thanks for trying the create CLI!");
	logger.log(
		"A full --help display isn't yet available, as the CLI is still being worked on.",
	);
	logger.log("See http://create-josh.vercel.app in the meantime.");
}
