import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { createSystemFetchers } from "../system/createSystemFetchers.js";
import { executePresetBlocks } from "./executePresetBlocks.js";

const presetContext = {
	directory: ".",
	display: {
		item: vi.fn(),
		log: vi.fn(),
	},
	fetchers: createSystemFetchers({ fetch: vi.fn() }),
	fs: { readFile: vi.fn(), writeDirectory: vi.fn(), writeFile: vi.fn() },
	runner: vi.fn(),
	take: vi.fn(),
};

const base = createBase({
	options: {
		value: z.string(),
	},
});

describe("runPreset", () => {
	test("files from one block", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
		});

		const preset = base.createPreset({
			about: {
				name: "Example Preset",
			},
			blocks: [block],
		});

		const result = executePresetBlocks({
			options: { value: "Hello, world!" },
			preset,
			presetContext,
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!",
			},
		});
	});

	it("adds addons when provided", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			addons: {
				extra: z.string().default(""),
			},
			produce({ addons, options }) {
				return {
					files: { "README.md": [options.value, addons.extra].join("\n") },
				};
			},
		});

		const preset = base.createPreset({
			about: {
				name: "Example Preset",
			},
			blocks: [block],
		});

		const result = executePresetBlocks({
			addons: [block({ extra: "line" })],
			options: { value: "Hello, world!" },
			preset,
			presetContext,
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!\nline",
			},
		});
	});

	describe("modes", () => {
		const block = base.createBlock({
			about: {
				name: "Example Block",
			},
			initialize({ options }) {
				return {
					files: {
						"data.txt": options.value,
					},
				};
			},
			migrate() {
				return {
					scripts: ["rm old.txt"],
				};
			},
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
		});

		const preset = base.createPreset({
			about: {
				name: "Example Preset",
			},
			blocks: [block],
		});

		it("does not augment creations with a Block's initialize() or migrate() when mode is undefined", () => {
			const result = executePresetBlocks({
				options: { value: "Hello, world!" },
				preset,
				presetContext,
			});

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's initialize() when mode is 'initialize'", () => {
			const result = executePresetBlocks({
				mode: "initialize",
				options: { value: "Hello, world!" },
				preset,
				presetContext,
			});

			expect(result).toEqual({
				files: {
					"data.txt": "Hello, world!",
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's migrate() when mode is 'migrate'", () => {
			const result = executePresetBlocks({
				mode: "migrate",
				options: { value: "Hello, world!" },
				preset,
				presetContext,
			});

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
				scripts: ["rm old.txt"],
			});
		});
	});
});
