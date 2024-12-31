import { describe, expect, test } from "vitest";

import { createConfig } from "../config/createConfig.js";
import { createBase } from "../creators/createBase.js";
import { isCreateConfig } from "./isCreateConfig.js";

const base = createBase({
	options: {},
});

const preset = base.createPreset({
	about: { name: "Test Preset" },
	blocks: [],
});

describe("isCreateConfig", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ preset: null }, false],
		[{ preset: {} }, false],
		[{ settings: null }, false],
		[{ settings: {} }, false],
		[{ preset: {}, settings: {} }, false],
		[{ preset: {}, settings: {} }, false],
		[{ preset }, true],
		[createConfig(preset), true],
		[createConfig(preset, {}), true],
	])("%j", (input, expected) => {
		const actual = isCreateConfig(input);

		expect(actual).toBe(expected);
	});
});
