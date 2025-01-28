import { describe, expect, test } from "vitest";

import { createConfig } from "../config/createConfig.js";
import { createBase } from "../creators/createBase.js";
import { isCreatedConfig } from "./isCreatedConfig.js";

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

describe("isCreatedConfig", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ template: null }, false],
		[{ template: {} }, false],
		[{ settings: { preset: "test" }, template: {} }, false],
		[{ settings: null }, false],
		[{ settings: {} }, false],
		[{ settings: {}, template: {} }, false],
		[{ settings: { preset: "test" }, template: {} }, false],
		[{ template }, false],
		[{ settings: null, template }, false],
		[{ settings: {}, template }, false],
		[{ settings: { preset: null }, template }, false],
		[{ settings: { preset: "test" }, template }, false],
		[createConfig(template, { preset: "test preset" }), true],
	])("%j", (input, expected) => {
		const actual = isCreatedConfig(input);

		expect(actual).toBe(expected);
	});
});
