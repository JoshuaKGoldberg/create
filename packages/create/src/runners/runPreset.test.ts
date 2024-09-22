import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createPreset } from "../creators/createPreset.js";
import { createSchema } from "../creators/createSchema.js";
import { runPreset } from "./runPreset.js";

const context = {
	fetcher: vi.fn(),
	fs: { readFile: vi.fn(), writeFile: vi.fn() },
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

		const preset = createPreset({
			about: {
				name: "Example Preset",
			},
			blocks: [block()],
			schema,
		});

		await runPreset(preset, { value: "Hello, world! " }, context);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "README.md",
			    "Hello, world! ",
			  ],
			]
		`);
	});

	test("files from two blocks in phase order", async () => {
		const blocks = [
			schema.createBlock({
				about: {
					name: "Example Block 1",
				},
				produce({ options }) {
					return {
						documentation: { Example: options.value },
					};
				},
			}),
			schema.createBlock({
				about: {
					name: "Example Block 2",
				},
				produce({ created }) {
					return {
						files: { "README.md": created.documentation.Example },
					};
				},
			}),
		];

		await runPreset(
			createPreset({
				about: {
					name: "Example",
				},
				blocks: blocks.map((block) => block()),
				schema,
			}),
			{ value: "Hello, world!" },
			context,
		);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "README.md",
			    "Hello, world!",
			  ],
			]
		`);
	});
});
