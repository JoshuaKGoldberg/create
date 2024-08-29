import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { createPreset } from "./createPreset.js";

describe("createPreset", () => {
	test("production without options", async () => {
		const creation = {
			files: {
				"README.md": "Hello, world!",
			},
		};

		const preset = createPreset({
			documentation: {
				name: "My Preset",
			},
			produce() {
				return [creation];
			},
		});

		const actual = await preset({
			fetcher: vi.fn(),
			fs: { readFile: vi.fn(), writeFile: vi.fn() },
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toEqual([creation]);
	});

	test("production with options", async () => {
		const description = "Hello, world!";

		const preset = createPreset({
			documentation: {
				name: "My Preset",
			},
			options: {
				description: z.string(),
			},
			produce({ options }) {
				return [
					{
						files: {
							"README.md": options.description,
						},
					},
				];
			},
		});

		const actual = await preset({
			fetcher: vi.fn(),
			fs: { readFile: vi.fn(), writeFile: vi.fn() },
			options: { description },
			runner: vi.fn(),
			take: vi.fn(),
		});

		expect(actual).toEqual([
			{
				files: {
					"README.md": description,
				},
			},
		]);
	});
});
