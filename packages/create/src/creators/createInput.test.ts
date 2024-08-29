import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createInput } from "./createInput.js";

describe("createInput", () => {
	test("production without options", () => {
		const expected = 123;

		const input = createInput({
			produce: () => expected,
		});

		const actual = input({
			fetcher: vi.fn(),
			fs: { readFile: vi.fn(), writeFile: vi.fn() },
			runner: vi.fn(),
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
			fetcher: vi.fn(),
			fs: { readFile: vi.fn(), writeFile: vi.fn() },
			options: {
				offset: 1000,
			},
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toBe(1234);
	});
});
