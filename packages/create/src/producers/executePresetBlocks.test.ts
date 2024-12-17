import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { createSystemFetchers } from "../system/createSystemFetchers.js";
import { executePresetBlocks } from "./executePresetBlocks.js";

const context = {
	directory: ".",
	fetchers: createSystemFetchers(vi.fn()),
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

		const result = executePresetBlocks(
			preset,
			{ value: "Hello, world!" },
			context,
			undefined,
		);

		expect(result).toEqual({
			addons: [],
			files: {
				"README.md": "Hello, world!",
			},
			requests: [],
			scripts: [],
		});
	});

	describe("initialize", () => {
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

		it("does not augment creations with a Block's initialize() when mode is undefined", () => {
			const result = executePresetBlocks(
				preset,
				{ value: "Hello, world!" },
				context,
				undefined,
			);

			expect(result).toEqual({
				addons: [],
				files: {
					"README.md": "Hello, world!",
				},
				requests: [],
				scripts: [],
			});
		});

		it("augments creations with a Block's initialize() when mode is 'new'", () => {
			const result = executePresetBlocks(
				preset,
				{ value: "Hello, world!" },
				context,
				"new",
			);

			expect(result).toEqual({
				addons: [],
				files: {
					"data.txt": "Hello, world!",
					"README.md": "Hello, world!",
				},
				requests: [],
				scripts: [],
			});
		});
	});
});
