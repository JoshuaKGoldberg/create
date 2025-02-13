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
		readDirectory: vi.fn(),
		readFile: vi.fn(),
		writeDirectory: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
};

describe("producePreset", () => {
	it("passes options to the preset when provided via options", () => {
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

		const preset = baseWithOption.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const actual = producePreset(preset, {
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

	it("passes offline to the preset when provided", () => {
		const baseWithoutOption = createBase({
			options: {},
		});

		const blockWithoutOption = baseWithoutOption.createBlock({
			produce({ offline }) {
				return {
					files: {
						"offline.txt": String(offline),
					},
				};
			},
		});

		const preset = baseWithoutOption.createPreset({
			about: { name: "Test" },
			blocks: [blockWithoutOption],
		});

		const actual = producePreset(preset, {
			...system,
			offline: true,
			options: {},
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"offline.txt": "true",
			},
		});
	});
});
