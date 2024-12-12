import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { producePreset } from "./producePreset.js";

const emptyCreation = {
	addons: [],
	files: {},
	scripts: [],
};

describe("producePreset", () => {
	describe("passed options", () => {
		const baseWithOption = createBase({
			options: {
				value: z.string(),
			},
		});

		const blockUsingOption = baseWithOption.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const presetUsingOption = baseWithOption.createPreset({
			blocks: [blockUsingOption],
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
		const baseWithProduce = createBase({
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

		const blockUsingOption = baseWithProduce.createBlock({
			produce({ options }) {
				return {
					files: {
						"value-optional.txt": options.optional,
						"value-required.txt": options.required,
					},
				};
			},
		});

		const presetUsingOption = baseWithProduce.createPreset({
			blocks: [blockUsingOption],
		});

		it("prioritizes provided options over Base produced options", async () => {
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
