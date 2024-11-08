import { createInput, createSchema } from "create";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { testPreset } from "./testPreset.js";

const emptyCreation = {
	commands: [],
	documentation: {},
	editor: {},
	files: {},
	jobs: [],
	metadata: [],
	package: {},
};

const schema = createSchema({
	options: {
		value: z.string(),
	},
});

describe("testPreset", () => {
	// TODO: It would be nice to also test the case of no options,
	// as testBlock.test.ts does with a @ts-expect-error.
	// However, the Object spreads in producePreset wipe Proxy `get`s... 🤷

	describe("options", () => {
		const blockUsingOptions = schema.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const presetUsingOptions = schema.createPreset({
			blocks: [blockUsingOptions()],
		});

		it("passes options to the block when provided via options", async () => {
			const actual = await testPreset(presetUsingOptions, {
				options: { value: "abc" },
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "abc" },
			});
		});

		it("passes options to the block when provided via optionsAugment", async () => {
			const actual = await testPreset(presetUsingOptions, {
				optionsAugment: () => ({ value: "abc" }),
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "abc" },
			});
		});

		it("passes options to the block when provided via options and optionsAugment", async () => {
			const actual = await testPreset(presetUsingOptions, {
				options: { value: "abc" },
				optionsAugment: (options) => ({
					value: [options.value, "def"].join("-"),
				}),
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "abc-def" },
			});
		});
	});

	describe("fetcher", () => {
		const inputFetcher = createInput({
			args: {
				value: z.string(),
			},
			async produce({ args, fetcher }) {
				return (await fetcher(args.value)).text();
			},
		});

		const blockUsingFetcher = schema.createBlock({
			async produce({ options, take }) {
				return {
					files: {
						"value.txt": await take(inputFetcher, { value: options.value }),
					},
				};
			},
		});

		const presetUsingFetcher = schema.createPreset({
			blocks: [blockUsingFetcher()],
		});

		it("throws an error when fetcher isn't provided and a block uses fetcher", async () => {
			await expect(async () =>
				testPreset(presetUsingFetcher, {
					options: { value: "def" },
				}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'fetcher' was used by an input but not provided.]`,
			);
		});

		it("passes fetcher to the block when provided", async () => {
			const fetcher = vi
				.fn()
				.mockResolvedValueOnce({ text: () => Promise.resolve("def") });

			const actual = await testPreset(presetUsingFetcher, {
				options: { value: "ghi" },
				system: { fetcher },
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "def" },
			});
			expect(fetcher).toHaveBeenCalledWith("ghi");
		});
	});

	describe("runner", () => {
		const inputRunner = createInput({
			args: {
				value: z.string(),
			},
			async produce({ args, runner }) {
				return (await runner(args.value)).stdout as string;
			},
		});

		const blockUsingRunner = schema.createBlock({
			async produce({ options, take }) {
				return {
					files: {
						"value.txt": await take(inputRunner, { value: options.value }),
					},
				};
			},
		});

		const presetUsingRunner = schema.createPreset({
			blocks: [blockUsingRunner()],
		});

		it("throws an error when runner isn't provided and a block uses runner", async () => {
			await expect(async () =>
				testPreset(presetUsingRunner, {
					options: { value: "def" },
				}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'runner' was used by an input but not provided.]`,
			);
		});

		it("passes runner to the block when provided", async () => {
			const runner = vi.fn().mockResolvedValueOnce({ stdout: "def" });

			const actual = await testPreset(presetUsingRunner, {
				options: { value: "ghi" },
				system: { runner },
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "def" },
			});
			expect(runner).toHaveBeenCalledWith("ghi");
		});
	});
});
