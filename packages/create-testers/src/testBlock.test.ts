import { createInput, createSchema } from "create";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { testBlock } from "./testBlock.js";

const schema = createSchema({
	options: {
		value: z.string(),
	},
});

const blockStandalone = schema.createBlock({
	produce() {
		return {
			files: {
				"value.txt": "abc",
			},
		};
	},
});

describe("testBlock", () => {
	it("doesn't throw an error when settings isn't provided and the block uses no settings", async () => {
		const actual = await testBlock(blockStandalone);

		expect(actual).toEqual({ files: { "value.txt": "abc" } });
	});

	it("doesn't throw an error when settings is {} and the block uses no settings", async () => {
		const actual = await testBlock(blockStandalone, {});

		expect(actual).toEqual({ files: { "value.txt": "abc" } });
	});

	describe("args", () => {
		const blockUsingArgs = schema.createBlock({
			args: {
				value: z.string(),
			},
			produce({ args }) {
				return {
					files: {
						"value.txt": args.value,
					},
				};
			},
		});

		it("throws an error when args isn't provided and a block uses args", async () => {
			await expect(
				// @ts-expect-error -- Intentionally not allowed by types.
				async () => await testBlock(blockUsingArgs, {}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'args' was used by a block but not provided.]`,
			);
		});

		it("passes args to the block when provided", async () => {
			const actual = await testBlock(blockUsingArgs, {
				args: { value: "abc" },
			});

			expect(actual).toEqual({ files: { "value.txt": "abc" } });
		});
	});

	describe("created", () => {
		const blockReturningCreated = schema.createBlock({
			produce({ created }) {
				return created;
			},
		});

		it("fills in defaults when created is not provided", async () => {
			const actual = await testBlock(blockReturningCreated);

			expect(actual).toEqual({
				documentation: {},
				editor: {},
				jobs: [],
				metadata: [],
			});
		});

		it("merges in created data when provided", async () => {
			const actual = await testBlock(blockReturningCreated, {
				created: {
					documentation: { abc: "def" },
				},
			});

			expect(actual).toEqual({
				documentation: { abc: "def" },
				editor: {},
				jobs: [],
				metadata: [],
			});
		});
	});

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

		it("throws an error when options isn't provided and a block uses options", async () => {
			await expect(
				async () =>
					await testBlock(blockUsingOptions, {
						take: vi.fn(),
					}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'options' was used by a block but not provided.]`,
			);
		});

		it("passes options to the block when provided", async () => {
			const actual = await testBlock(blockUsingOptions, {
				options: { value: "abc" },
				take: vi.fn(),
			});

			expect(actual).toEqual({ files: { "value.txt": "abc" } });
		});
	});

	describe("take", () => {
		const inputString = createInput({
			args: {
				value: z.string(),
			},
			produce({ args }) {
				return args.value;
			},
		});

		const blockUsingTake = schema.createBlock({
			produce({ options, take }) {
				return {
					files: {
						"value.txt": take(inputString, { value: options.value }),
					},
				};
			},
		});

		it("throws an error when take isn't provided and a block uses take", async () => {
			await expect(async () =>
				testBlock(blockUsingTake, {
					options: { value: "def" },
				}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'take' was used by a block but not provided.]`,
			);
		});

		it("passes take to the block when provided", async () => {
			const take = vi.fn().mockReturnValueOnce("def");

			const actual = await testBlock(blockUsingTake, {
				options: { value: "abc" },
				take,
			});

			expect(actual).toEqual({ files: { "value.txt": "def" } });
			expect(take).toHaveBeenCalledWith(inputString, { value: "abc" });
		});
	});
});
