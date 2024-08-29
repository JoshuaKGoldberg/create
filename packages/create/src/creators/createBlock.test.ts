import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import { Creation } from "../types/creations.js";
import { TakeInput } from "../types/inputs.js";
import { createBlock } from "./createBlock.js";
import { createInput } from "./createInput.js";

const fetcher = vi.fn();
const fs = { readFile: vi.fn(), writeFile: vi.fn() };
const runner = vi.fn();

const take: TakeInput = (input, options) =>
	input({ fetcher, fs, options, runner, take } as Parameters<TakeInput>[0]);

describe("createBlock", () => {
	describe("blocks", () => {
		test("production without options", async () => {
			const creation: Creation = {
				files: {},
			};

			const block = createBlock({
				produce: () => creation,
			});

			const actual = await block({
				fetcher,
				fs,
				runner,
				take,
			});

			expect(actual).toBe(creation);
		});

		test("production with options", async () => {
			const fileName = "";

			const block = createBlock({
				options: {
					fileName: z.string(),
				},
				produce: ({ options }) => ({
					files: {
						[options.fileName]: `Hello, world!`,
					},
				}),
			});

			const actual = await block({
				fetcher,
				fs,
				options: { fileName },
				runner,
				take,
			});

			expect(actual).toEqual({
				files: {
					[fileName]: `Hello, world!`,
				},
			});
		});

		test("production with option-less input", async () => {
			const fakeInput = createInput({
				produce: () => true,
			});

			const block = createBlock({
				produce: ({ take }) => ({
					files: {
						"file.txt": take(fakeInput, {}).toString(),
					},
				}),
			});

			const actual = await block({
				fetcher,
				fs,
				runner,
				take,
			});

			expect(actual).toEqual({
				files: {
					"file.txt": "true",
				},
			});
		});

		test("production with options input", async () => {
			const fakeInput = createInput({
				options: {
					value: z.boolean(),
				},
				produce: ({ options }) => options.value,
			});

			const block = createBlock({
				produce: ({ take }) => ({
					files: {
						"file.txt": take(fakeInput, { value: true }).toString(),
					},
				}),
			});

			const actual = await block({
				fetcher,
				fs,
				runner,
				take,
			});

			expect(actual).toEqual({
				files: {
					"file.txt": "true",
				},
			});
		});
	});

	describe("addons", () => {
		const block = createBlock({
			options: {
				fileName: z.string(),
			},
			produce: ({ options }) => ({
				files: {
					[options.fileName]: `Hello, world!`,
				},
			}),
		});

		test("production without options", async () => {
			const addon = block.createAddon({
				produce: () => ({
					fileName: "added",
				}),
			});

			const actual = await addon({
				fetcher,
				fs,
				runner,
				take,
			});

			expect(actual).toEqual({
				fileName: "added",
			});
		});

		test("production with options", async () => {
			const addon = block.createAddon({
				options: {
					index: z.number(),
				},
				produce: ({ options }) => ({
					fileName: `added-${options.index.toString()}`,
				}),
			});

			const actual = await addon({
				fetcher,
				fs,
				options: { index: 1 },
				runner,
				take,
			});

			expect(actual).toEqual({
				fileName: "added-1",
			});
		});
	});
});
