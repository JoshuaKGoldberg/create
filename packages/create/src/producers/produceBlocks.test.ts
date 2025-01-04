import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { createSystemFetchers } from "../system/createSystemFetchers.js";
import { produceBlocks } from "./produceBlocks.js";

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

		const result = produceBlocks([block], {
			options: { value: "Hello, world!" },
			system: presetContext,
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
				extra: z.string().optional(),
			},
			produce({ addons, options }) {
				return {
					files: { "README.md": [options.value, addons.extra].join("\n") },
				};
			},
		});

		const result = produceBlocks([block], {
			addons: [block({ extra: "line" })],
			options: { value: "Hello, world!" },
			system: presetContext,
		});

		expect(result).toEqual({
			files: {
				"README.md": "Hello, world!\nline",
			},
		});
	});

	it("doesn't include addons to blocks that aren't defined", () => {
		const blockKnown = base.createBlock({
			about: {
				name: "Known Block",
			},
			produce({ options }) {
				return {
					addons: [blockUnknown({ extra: "line" })],
					files: { "README.md": options.value },
				};
			},
		});

		const blockUnknown = base.createBlock({
			about: {
				name: "Unknown Block",
			},
			addons: {
				extra: z.string().optional(),
			},
			produce({ addons, options }) {
				return {
					files: { "UNKNOWN.md": [options.value, addons.extra].join("\n") },
				};
			},
		});

		const result = produceBlocks([blockKnown], {
			options: { value: "Hello, world!" },
			system: presetContext,
		});

		expect(result).toEqual({
			addons: [blockUnknown({ extra: "line" })],
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

		it("does not augment creations with a Block's initialize() or migrate() when mode is undefined", () => {
			const result = produceBlocks([block], {
				options: { value: "Hello, world!" },
				system: presetContext,
			});

			expect(result).toEqual({
				files: {
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's initialize() when mode is 'initialize'", () => {
			const result = produceBlocks([block], {
				mode: "initialize",
				options: { value: "Hello, world!" },
				system: presetContext,
			});

			expect(result).toEqual({
				files: {
					"data.txt": "Hello, world!",
					"README.md": "Hello, world!",
				},
			});
		});

		it("augments creations with a Block's migrate() when mode is 'migrate'", () => {
			const result = produceBlocks([block], {
				mode: "migrate",
				options: { value: "Hello, world!" },
				system: presetContext,
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
