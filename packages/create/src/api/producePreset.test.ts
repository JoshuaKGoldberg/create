import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { producePreset } from "./producePreset.js";

const emptyCreation = {
	commands: [],
	files: {},
};

describe("producePreset", () => {
	describe("passed options", () => {
		const baseWithOption = createBase({
			options: {
				value: z.string(),
			},
		});

		const blockUsingOption = baseWithOption.createBlock({
			build({ options }) {
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

		it("passes options to the preset when provided via options and optionsAugment", async () => {
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
		const baseWithRead = createBase({
			options: {
				optional: z.string().optional(),
				required: z.string(),
			},
			read() {
				return {
					optional: "optional-from-produce",
					required: "required-from-produce",
				};
			},
		});

		const blockUsingOption = baseWithRead.createBlock({
			build({ options }) {
				return {
					files: {
						"value-optional.txt": options.optional,
						"value-required.txt": options.required,
					},
				};
			},
		});

		const presetUsingOption = baseWithRead.createPreset({
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

	describe("finalization", () => {
		it("runs block finalization after building", async () => {
			const baseWithOption = createBase({
				options: {
					value: z.string(),
				},
			});

			const blockWithAddon = baseWithOption.createBlock({
				build({ options }) {
					return {
						addons: [
							blockWithFinalize({
								repeat: 2,
							}),
						],
						files: {
							"value.txt": options.value,
						},
					};
				},
			});

			const blockWithFinalize = baseWithOption.createBlock({
				addons: {
					repeat: z.number().default(1),
				},
				build({ addons, options }) {
					return {
						files: {
							"before.txt": options.value.repeat(addons.repeat),
						},
					};
				},
				finalize({ addons, created, options }) {
					return {
						files: {
							"created-options": created.files,
							"finalized-options": options.value.repeat(addons.repeat),
						},
					};
				},
			});

			const presetUsingBoth = baseWithOption.createPreset({
				blocks: [blockWithAddon, blockWithFinalize],
			});

			const actual = await producePreset(presetUsingBoth, {
				options: { value: "abc-" },
			});

			expect(actual).toEqual({
				commands: [],
				files: {
					"before.txt": "abc-abc-",
					"created-options": {
						"before.txt": "abc-abc-",
						"value.txt": "abc-",
					},
					"finalized-options": "abc-abc-",
					"value.txt": "abc-",
				},
			});
		});
	});
});
