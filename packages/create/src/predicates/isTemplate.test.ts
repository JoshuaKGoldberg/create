import { describe, expect, test } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { isTemplate } from "./isTemplate.js";

const template = createTemplate({
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
