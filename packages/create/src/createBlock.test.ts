import { describe, expect, test } from "vitest";
import { z } from "zod";

import { createBlock } from "./createBlock";
import { createInput } from "./createInput";
import { Creation, TakeInput } from "./shared";

const take: TakeInput = (input, options) => input({ options, take });

describe("createBlock", () => {
	describe("blocks", () => {
		test("production without options", async () => {
			const creation: Creation = {
				files: {},
			};

			const block = createBlock({
				options: {},
				produce: () => creation,
			});

			const actual = await block({
				options: {},
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
				options: { fileName },
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
				options: {},
				produce: () => true,
			});

			const block = createBlock({
				options: {},
				produce: ({ take }) => ({
					files: {
						"file.txt": take(fakeInput, {}).toString(),
					},
				}),
			});

			const actual = await block({
				options: {},
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
				options: {},
				produce: ({ take }) => ({
					files: {
						"file.txt": take(fakeInput, { value: true }).toString(),
					},
				}),
			});

			const actual = await block({
				options: {},
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
				options: {},
				produce: () => ({
					fileName: "added",
				}),
			});

			const actual = await addon({
				options: { index: 1 },
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
				options: { index: 1 },
				take,
			});

			expect(actual).toEqual({
				fileName: "added-1",
			});
		});
	});
});
