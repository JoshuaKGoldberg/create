import { createBase } from "create";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testTemplate } from "./testTemplate.js";

const emptyCreation = {
	addons: [],
	files: {},
	requests: [],
	scripts: [],
	suggestions: [],
};

const base = createBase({
	options: {
		value: z.string(),
	},
});

describe("testPreset", () => {
	describe("options", () => {
		const blockUsingOptions = base.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const presetUsingOptions = base.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOptions],
		});

		const template = base.createTemplate({ presets: [presetUsingOptions] });

		it("passes options to the block when provided via options", async () => {
			const actual = await testTemplate(template, {
				options: { value: "abc" },
				preset: presetUsingOptions,
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "abc" },
			});
		});
	});
});
