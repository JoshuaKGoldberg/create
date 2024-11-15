import { createSchema } from "create";
import { describe, expect, it } from "vitest";
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
	it("doesn't throw an error when settings isn't provided and the block uses no settings", () => {
		const actual = testBlock(blockStandalone);

		expect(actual).toEqual({ files: { "value.txt": "abc" } });
	});

	it("doesn't throw an error when settings is {} and the block uses no settings", () => {
		const actual = testBlock(blockStandalone, {});

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

		it("throws an error when args isn't provided and a block uses args", () => {
			expect(
				// @ts-expect-error -- Intentionally not allowed by types.
				() => testBlock(blockUsingArgs, {}),
			).toThrowErrorMatchingInlineSnapshot(
				`[Error: Context property 'args' was used by the block but not provided.]`,
			);
		});

		it("passes args to the block when provided", () => {
			const actual = testBlock(blockUsingArgs, {
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

		it("fills in defaults when created is not provided", () => {
			const actual = testBlock(blockReturningCreated);

			expect(actual).toEqual({
				documentation: {},
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

		it("throws an error when options isn't provided and a block uses options", () => {
			expect(() =>
				testBlock(blockUsingOptions),
			).toThrowErrorMatchingInlineSnapshot(
				`[Error: Context property 'options' was used by the block but not provided.]`,
			);
		});

		it("passes options to the block when provided", () => {
			const actual = testBlock(blockUsingOptions, {
				options: { value: "abc" },
			});

			expect(actual).toEqual({ files: { "value.txt": "abc" } });
		});
	});
});
