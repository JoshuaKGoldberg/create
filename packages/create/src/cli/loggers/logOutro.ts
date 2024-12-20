import * as prompts from "@clack/prompts";

export function logOutro(message: string, suggestions?: string[]) {
	prompts.outro(message);

	if (suggestions?.length) {
		console.log("Be sure to:");
		console.log();

		for (const suggestion of suggestions) {
			console.log(suggestion);
		}

		console.log();
	}
}
