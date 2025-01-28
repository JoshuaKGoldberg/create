import { describe, expect, it } from "vitest";

import { createBase } from "../creators/createBase.js";
import { createConfig } from "./createConfig.js";

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

describe("createConfig", () => {
	it("throws an error when the preset cannot be found by name", () => {
		const act = () => createConfig(template, { preset: "other" });

		expect(act).toThrowErrorMatchingInlineSnapshot(
			`[Error: other is not one of: test-preset]`,
		);
	});

	it("returns an object when the preset can be found", () => {
		const actual = createConfig(template, { preset: "test-preset" });

		expect(actual).toEqual({ preset, settings: {}, template });
	});
});
