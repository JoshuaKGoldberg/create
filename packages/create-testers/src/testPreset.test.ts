import { createBase } from "create";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testPreset } from "./testPreset.js";

const emptyCreation = {
	commands: [],
	files: {},
};

const base = createBase({
	options: {
		value: z.string(),
	},
});

describe("testPreset", () => {
	// TODO: It would be nice to also test the case of no options,
	// as testBlock.test.ts does with a @ts-expect-error.
	// However, the Object spreads in producePreset wipe Proxy `get`s... 🤷

	describe("options", () => {
		const blockUsingOptions = base.createBlock({
			build({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const presetUsingOptions = base.createPreset({
			blocks: [blockUsingOptions],
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
});
