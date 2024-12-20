import { createBase } from "create";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { testPreset } from "./testPreset.js";

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

		it("passes options to the block when provided via options", async () => {
			const actual = await testPreset(presetUsingOptions, {
				options: { value: "abc" },
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: { "value.txt": "abc" },
			});
		});
	});
});
