import { createInput } from "create";
import { z } from "zod";

export const inputFromScript = createInput({
	args: {
		command: z.string(),
	},
	async produce({ args, runner }) {
		return await runner(args.command);
	},
});