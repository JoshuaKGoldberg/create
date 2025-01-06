import { describe, expect, it, vi } from "vitest";

import { createBase } from "../creators/createBase.js";
import { createConfig } from "./createConfig.js";
import { tryImportConfig } from "./tryImportConfig.js";

const base = createBase({
	options: {},
});

const preset = base.createPreset({
	about: { name: "Test Preset" },
	blocks: [],
});

describe("tryImportConfig", () => {
	it("returns an error when the module cannot be imported", async () => {
		const actual = await tryImportConfig("does-not-exist");

		expect(actual).toMatchInlineSnapshot(
			`[Error: Failed to load url does-not-exist (resolved id: does-not-exist). Does the file exist?]`,
		);
	});

	it("returns an error when the module is imported but is not a config", async () => {
		vi.mock("not-a-config", () => ({
			default: {},
		}));

		const actual = await tryImportConfig("not-a-config");

		expect(actual).toMatchInlineSnapshot(
			`
			{
			  "preset": {
			    "about": {
			      "name": "Test Preset",
			    },
			    "base": {
			      "createBlock": [Function],
			      "createPreset": [Function],
			      "createTemplate": [Function],
			      "options": {},
			    },
			    "blocks": [],
			  },
			  "settings": undefined,
			}
		`,
		);
	});

	it("returns the config when the module is imported and is a config", async () => {
		vi.mock("not-a-config", () => ({
			default: createConfig(preset),
		}));

		const actual = await tryImportConfig("not-a-config");

		expect(actual).toMatchInlineSnapshot(
			`
			{
			  "preset": {
			    "about": {
			      "name": "Test Preset",
			    },
			    "base": {
			      "createBlock": [Function],
			      "createPreset": [Function],
			      "createTemplate": [Function],
			      "options": {},
			    },
			    "blocks": [],
			  },
			  "settings": undefined,
			}
		`,
		);
	});
});
