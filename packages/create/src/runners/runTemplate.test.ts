import { Octokit } from "octokit";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { runTemplate } from "./runTemplate.js";

const base = createBase({
	options: {
		title: z.string(),
	},
});

function createSystem() {
	return {
		fetchers: {
			fetch: noop("fetch"),
			octokit: {} as Octokit,
		},
		fs: {
			readDirectory: noop("readDirectory"),
			readFile: noop("readFile"),
			writeDirectory: vi.fn(),
			writeFile: vi.fn(),
		},
		runner: noop("runner"),
	};
}

function noop(label: string) {
	return vi.fn().mockReturnValue(`Not implemented: ${label}`);
}

describe("runTemplate", () => {
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
			about: { name: "Test" },
			blocks: [block],
		});

		const template = base.createTemplate({
			presets: [preset],
		});

		const system = createSystem();

		await runTemplate(template, {
			options: { title: "abc" },
			preset: "test",
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
			about: { name: "Test" },
			blocks: [blockProvidingAddon, blockWithAddon],
		});

		const template = base.createTemplate({
			presets: [preset],
		});

		const system = createSystem();

		await runTemplate(template, {
			options: { title: "abc" },
			preset: "test",
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
