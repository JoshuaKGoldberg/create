import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { executePresetBlocks } from "./executePresetBlocks.js";

const context = {
	fetcher: vi.fn(),
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

		executePresetBlocks(preset, { value: "Hello, world! " }, context);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`[]`);
	});
});
