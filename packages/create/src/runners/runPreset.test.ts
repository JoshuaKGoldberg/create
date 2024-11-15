import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createSchema } from "../creators/createSchema.js";
import { runPreset } from "./runPreset.js";

const context = {
	fetcher: vi.fn(),
	fs: { readFile: vi.fn(), writeDirectory: vi.fn(), writeFile: vi.fn() },
	runner: vi.fn(),
	take: vi.fn(),
};

const schema = createSchema({
	options: {
		value: z.string(),
	},
});

describe("runPreset", () => {
	test("files from one block", async () => {
		const block = schema.createBlock({
			about: {
				name: "Example Block",
			},
			produce({ options }) {
				return {
					files: { "README.md": options.value },
				};
			},
		});

		const preset = schema.createPreset({
			about: {
				name: "Example Preset",
			},
			blocks: [block()],
		});

		await runPreset(preset, { value: "Hello, world! " }, context);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`[]`);
	});
});
