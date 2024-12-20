import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
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

const system = {
	fetchers: {
		fetch: vi.fn(),
		octokit: {} as Octokit,
	},
	fs: {
		readFile: vi.fn(),
		writeDirectory: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
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
			...system,
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
