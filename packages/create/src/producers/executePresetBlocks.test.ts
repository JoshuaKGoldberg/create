import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { createSystemFetchers } from "../system/createSystemFetchers.js";
import { executePresetBlocks } from "./executePresetBlocks.js";

const context = {
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

		const result = executePresetBlocks(
			preset,
			{ value: "Hello, world!" },
			context,
			undefined,
		);

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!",
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
			const result = executePresetBlocks(
				preset,
				{ value: "Hello, world!" },
				context,
				undefined,
			);

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's initialize() when mode is 'initialize'", () => {
			const result = executePresetBlocks(
				preset,
				{ value: "Hello, world!" },
				context,
				"initialize",
			);

			expect(result).toEqual({
				files: {
					"data.txt": "Hello, world!",
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's migrate() when mode is 'migrate'", () => {
			const result = executePresetBlocks(
				preset,
				{ value: "Hello, world!" },
				context,
				"migrate",
			);

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
				scripts: ["rm old.txt"],
			});
		});
	});
});
