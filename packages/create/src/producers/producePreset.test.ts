import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { producePreset } from "./producePreset.js";

const emptyCreation = {
	addons: [],
	files: {},
	requests: [],
	scripts: [],
	suggestions: [],
};

describe("producePreset", () => {
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
		about: { name: "Test" },
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
});
