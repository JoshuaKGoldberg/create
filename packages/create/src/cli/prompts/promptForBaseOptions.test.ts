import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../../creators/createBase.js";
import { promptForBaseOptions } from "./promptForBaseOptions.js";

const mockCancel = Symbol("cancel");

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
}));

const mockPromptForSchema = vi.fn();

vi.mock("./promptForSchema", () => ({
	get promptForSchema() {
		return mockPromptForSchema;
	},
}));

const system = {
	directory: ".",
	display: { item: vi.fn(), log: vi.fn() },
	fetchers: {
		fetch: vi.fn(),
		octokit: {} as Octokit,
	},
	fs: {
		readDirectory: vi.fn(),
		readFile: vi.fn(),
		writeDirectory: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
	take: vi.fn(),
};

describe("promptForBaseOptions", () => {
	it("returns options without prompting when all options are inferred by produce()", async () => {
		const base = createBase({
			options: {
				first: z.number(),
				second: z.number(),
			},
			produce({ options }) {
				return {
					second: options.first,
				};
			},
		});

		const options = await promptForBaseOptions(base, {
			existing: { first: 1 },
			system,
		});

		expect(options).toEqual({
			cancelled: false,
			completed: {
				directory: system.directory,
				first: 1,
				second: 1,
			},
			prompted: {},
		});
	});

	it("returns options without prompting when all non-inferred options are optional", async () => {
		const base = createBase({
			options: {
				first: z.number(),
				second: z.number().optional(),
			},
		});

		const options = await promptForBaseOptions(base, {
			existing: { first: 1 },
			system,
		});

		expect(options).toEqual({
			cancelled: false,
			completed: {
				directory: system.directory,
				first: 1,
			},
			prompted: {},
		});
	});

	describe("prompting", () => {
		const zSecond = z.number().default(-1);
		const base = createBase({
			options: {
				first: z.number(),
				second: zSecond,
			},
		});

		it("returns the cancellation when it an option not inferred, has a default value, and the prompt is canceled", async () => {
			mockPromptForSchema.mockResolvedValueOnce(mockCancel);

			const options = await promptForBaseOptions(base, {
				existing: { first: 1 },
				system,
			});

			expect(options).toEqual({
				cancelled: true,
				prompted: {},
			});
			expect(mockPromptForSchema).toHaveBeenCalledWith("second", zSecond, -1);
		});

		it("returns a prompted option when it is not inferred, has a default value, and the prompt succeeds", async () => {
			mockPromptForSchema.mockResolvedValueOnce(2);

			const options = await promptForBaseOptions(base, {
				existing: { first: 1 },
				system,
			});

			expect(options).toEqual({
				cancelled: false,
				completed: {
					directory: system.directory,
					first: 1,
					second: 2,
				},
				prompted: {
					second: 2,
				},
			});
			expect(mockPromptForSchema).toHaveBeenCalledWith("second", zSecond, -1);
		});
	});
});
