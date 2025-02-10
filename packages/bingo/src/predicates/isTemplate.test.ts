import { describe, expect, test, vi } from "vitest";

import { createTemplate } from "../creators/createTemplate.js";
import { isTemplate } from "./isTemplate.js";

const template = createTemplate({
	about: { name: "Test Template" },
	options: {},
	produce: vi.fn(),
});

describe("isTemplate", () => {
	test.each([
		[null, false],
		[undefined, false],
		[123, false],
		["abc", false],
		[{}, false],
		[{ options: {} }, false],
		[{ options: {}, produce: () => undefined }, false],
		[template, true],
	])("%j", (input, expected) => {
		const actual = isTemplate(input);

		expect(actual).toBe(expected);
	});
});
