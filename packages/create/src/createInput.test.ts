import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createInput } from "./createInput";

describe("createInput", () => {
	test("production without options", () => {
		const expected = 123;

		const input = createInput({
			options: {},
			produce: () => expected,
		});

		const actual = input({
			options: {},
			take: vi.fn(),
		});

		expect(actual).toBe(expected);
	});

	test("production with options", () => {
		const expected = 234;

		const input = createInput({
			options: {
				offset: z.number(),
			},
			produce: ({ options }) => expected + options.offset,
		});

		const actual = input({
			options: {
				offset: 1000,
			},
			take: vi.fn(),
		});

		expect(actual).toBe(1234);
	});
});
