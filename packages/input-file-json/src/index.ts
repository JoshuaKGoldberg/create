import { createInput } from "create";
import { inputFile } from "input-file";
import { z } from "zod";

export const inputFileJSON = createInput({
	args: {
		filePath: z.string(),
	},
	async produce({ args, take }) {
		const text = await take(inputFile, args);

		if (text instanceof Error) {
			return text;
		}

		try {
			return JSON.parse(text) as unknown;
		} catch (error) {
			return error as SyntaxError;
		}
	},
});
