import { createInput } from "create";
import { inputFromFile } from "input-from-file";
import { z } from "zod";

export const inputFromFileJSON = createInput({
	args: {
		filePath: z.string(),
	},
	async produce({ args, take }) {
		const text = await take(inputFromFile, args);

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
