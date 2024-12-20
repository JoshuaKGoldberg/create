import path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { createInput } from "../creators/createInput.js";
import { produceInput } from "./produceInput.js";

const input = createInput({
	args: {
		value: z.number(),
	},
	async produce({ args, runner }) {
		return {
			directory: (await runner("pwd")).stdout,
			doubled: args.value * 2,
		};
	},
});

describe("produceInput", () => {
	it("defaults directory to '.' when not provided", async () => {
		const actual = await produceInput(input, { args: { value: 2 } });

		expect(actual).toEqual({
			directory: process.cwd(),
			doubled: 4,
		});
	});

	it("sets directory when provided", async () => {
		const directory = path.join(process.cwd(), "..");

		const actual = await produceInput(input, {
			args: { value: 2 },
			directory,
		});

		expect(actual).toEqual({
			directory,
			doubled: 4,
		});
	});
});