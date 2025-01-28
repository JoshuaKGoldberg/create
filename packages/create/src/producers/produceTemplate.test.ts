import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { produceTemplate } from "./produceTemplate.js";

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

describe("produceTemplate", () => {
	it("passes options to the preset when provided via options", async () => {
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

		const template = baseWithOption.createTemplate({
			presets: [presetUsingOption],
		});

		const actual = await produceTemplate(template, {
			...system,
			options: {
				value: "abc",
			},
			preset: presetUsingOption,
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"value.txt": "abc",
			},
		});
	});

	it("passes offline to the preset when provided", async () => {
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

		const presetWithoutOption = baseWithoutOption.createPreset({
			about: { name: "Test" },
			blocks: [blockWithoutOption],
		});

		const template = baseWithoutOption.createTemplate({
			presets: [presetWithoutOption],
		});

		const actual = await produceTemplate(template, {
			...system,
			offline: true,
			options: {},
			preset: presetWithoutOption,
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"offline.txt": "true",
			},
		});
	});

	it("aliases a preset to its name when provided as a string", async () => {
		const base = createBase({
			options: {},
		});

		const blockUsingOption = base.createBlock({
			produce() {
				return {
					files: {
						"value.txt": "abc",
					},
				};
			},
		});

		const presetUsingOption = base.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const template = base.createTemplate({
			presets: [presetUsingOption],
		});

		const actual = await produceTemplate(template, {
			...system,
			options: {
				value: "abc",
			},
			preset: "test",
		});

		expect(actual).toEqual({
			...emptyCreation,
			files: {
				"value.txt": "abc",
			},
		});
	});

	it("throws an error when a preset string cannot be matched to its name", async () => {
		const base = createBase({
			options: {},
		});

		const blockUsingOption = base.createBlock({
			produce() {
				return {
					files: {
						"value.txt": "abc",
					},
				};
			},
		});

		const presetUsingOption = base.createPreset({
			about: { name: "Test" },
			blocks: [blockUsingOption],
		});

		const template = base.createTemplate({
			presets: [presetUsingOption],
		});

		const act = async () =>
			await produceTemplate(template, {
				...system,
				options: {
					value: "abc",
				},
				preset: "other",
			});

		await expect(act).rejects.toMatchInlineSnapshot(
			`[Error: other is not one of: test]`,
		);
	});
});
