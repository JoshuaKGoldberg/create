import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createInput } from "./createInput.js";

describe("createInput", () => {
	test("production without args", () => {
		const expected = 123;

		const input = createInput({
			run: () => expected,
		});

		const actual = input({
			fetcher: vi.fn(),
			fs: { readFile: vi.fn() },
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toBe(expected);
	});

	test("production with args", () => {
		const expected = 234;

		const input = createInput({
			args: {
				offset: z.number(),
			},
			run: ({ args }) => expected + args.offset,
		});

		const actual = input({
			args: {
				offset: 1000,
			},
			fetcher: vi.fn(),
			fs: { readFile: vi.fn() },
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toBe(1234);
	});
});
