import { describe, expect, it, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { runPreset } from "./runPreset.js";

const base = createBase({
	options: {
		title: z.string(),
	},
});

function noop(label: string) {
	return vi.fn(() => {
		throw new Error(`Not implemented: ${label}`);
	});
}

function createSystem() {
	return {
		fetcher: noop("fetcher"),
		fs: {
			readFile: noop("readFile"),
			writeDirectory: vi.fn(),
			writeFile: vi.fn(),
		},
		runner: noop("runner"),
	};
}

describe("runPreset", () => {
	test("Preset with one Block", async () => {
		const block = base.createBlock({
			produce({ options }) {
				return {
					files: {
						"README.md": `# ${options.title}`,
					},
				};
			},
		});

		const preset = base.createPreset({
			blocks: [block],
		});

		const system = createSystem();

		await runPreset(preset, {
			options: { title: "abc" },
			...system,
		});

		expect({
			writeDirectory: system.fs.writeDirectory.mock.calls,
			writeFile: system.fs.writeFile.mock.calls,
		}).toMatchInlineSnapshot(`
			{
			  "writeDirectory": [
			    [
			      ".",
			    ],
			  ],
			  "writeFile": [
			    [
			      "README.md",
			      "# abc
			",
			    ],
			  ],
			}
		`);
	});

	test("Preset with two Blocks", async () => {
		const blockWithAddon = base.createBlock({
			addons: {
				descriptions: z.array(z.string()).default([]),
			},
			produce({ addons, options }) {
				return {
					files: {
						"README.md": `# ${options.title}\n${addons.descriptions.join("\n")}`,
					},
				};
			},
		});

		const blockProvidingAddon = base.createBlock({
			produce() {
				return {
					addons: [
						blockWithAddon({
							descriptions: ["def"],
						}),
					],
				};
			},
		});

		const preset = base.createPreset({
			blocks: [blockProvidingAddon, blockWithAddon],
		});

		const system = createSystem();

		await runPreset(preset, {
			options: { title: "abc" },
			...system,
		});

		expect({
			writeDirectory: system.fs.writeDirectory.mock.calls,
			writeFile: system.fs.writeFile.mock.calls,
		}).toMatchInlineSnapshot(`
			{
			  "writeDirectory": [
			    [
			      ".",
			    ],
			  ],
			  "writeFile": [
			    [
			      "README.md",
			      "# abc

			def
			",
			    ],
			  ],
			}
		`);
	});
});
