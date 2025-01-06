import { describe, expect, test } from "vitest";

import { createBase } from "../creators/createBase.js";
import { isTemplate } from "./isTemplate.js";

const base = createBase({
	options: {},
});

const template = base.createTemplate({
	presets: [],
});

describe("isTemplate", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ presets: {} }, false],
		[template, true],
	])("%j", (input, expected) => {
		const actual = isTemplate(input);

		expect(actual).toBe(expected);
	});
});
