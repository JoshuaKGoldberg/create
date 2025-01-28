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

const template = base.createTemplate({
	presets: [preset],
});

let mockImportedConfig: unknown;

vi.mock("not-a-config", () => ({
	get default() {
		return mockImportedConfig;
	},
}));

describe("tryImportConfig", () => {
	it("returns an error when the module cannot be imported", async () => {
		const actual = await tryImportConfig("does-not-exist");

		expect(actual).toMatchInlineSnapshot(
			`[Error: Failed to load url does-not-exist (resolved id: does-not-exist). Does the file exist?]`,
		);
	});

	it("returns an error when the module is imported but is not a config", async () => {
		mockImportedConfig = {};

		const actual = await tryImportConfig("not-a-config");

		expect(actual).toMatchInlineSnapshot(
			`[Error: The default export of not-a-config should be a config from createConfig().]`,
		);
	});

	it("returns the config when the module is imported and is a config", async () => {
		mockImportedConfig = createConfig(template, {
			preset: "test-preset",
		});

		const actual = await tryImportConfig("not-a-config");

		expect(actual).toEqual({ preset, settings: {}, template });
	});
});
