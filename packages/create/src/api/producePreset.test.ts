import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createSchema } from "../creators/createSchema.js";
import { producePreset } from "./producePreset.js";

const emptyCreation = {
	commands: [],
	documentation: {},
	editor: {},
	files: {},
	jobs: [],
	package: {},
};

describe("producePreset", () => {
	describe("passed options", () => {
		const schemaWithOption = createSchema({
			options: {
				value: z.string(),
			},
		});

		const blockUsingOption = schemaWithOption.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const presetUsingOption = schemaWithOption.createPreset({
			blocks: [blockUsingOption()],
		});

		it("passes options to the preset when provided via options", async () => {
			const actual = await producePreset(presetUsingOption, {
				options: {
					value: "abc",
				},
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value.txt": "abc",
				},
			});
		});

		it("passes options to the preset when provided via optionsAugment", async () => {
			const actual = await producePreset(presetUsingOption, {
				optionsAugment: () => ({
					value: "abc",
				}),
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value.txt": "abc",
				},
			});
		});

		it("passes options to the preset when provided via options and  optionsAugment", async () => {
			const actual = await producePreset(presetUsingOption, {
				options: {
					value: "abc",
				},
				optionsAugment: (existing) => ({
					value: [existing.value, "def"].join("-"),
				}),
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value.txt": "abc-def",
				},
			});
		});
	});

	describe("directly produced options", () => {
		const schemaWithProduce = createSchema({
			options: {
				optional: z.string().optional(),
				required: z.string(),
			},
			produce() {
				return {
					optional: "optional-from-produce",
					required: "required-from-produce",
				};
			},
		});

		const blockUsingOption = schemaWithProduce.createBlock({
			produce({ options }) {
				return {
					files: {
						"value-optional.txt": options.optional,
						"value-required.txt": options.required,
					},
				};
			},
		});

		const presetUsingOption = schemaWithProduce.createPreset({
			blocks: [blockUsingOption()],
		});

		it("prioritizes provided options over schema produced options", async () => {
			const actual = await producePreset(presetUsingOption, {
				options: {
					required: "required-from-provided",
				},
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value-optional.txt": "optional-from-produce",
					"value-required.txt": "required-from-provided",
				},
			});
		});
	});
});
