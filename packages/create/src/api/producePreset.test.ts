import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createInput } from "../creators/createInput.js";
import { createSchema } from "../creators/createSchema.js";
import {
	Input,
	InputArgsFor,
	InputContextWithArgs,
	TakeInput,
} from "../types/inputs.js";
import { SystemContext } from "../types/system.js";
import { producePreset } from "./producePreset.js";

const emptyCreation = {
	commands: [],
	documentation: {},
	editor: {},
	files: {},
	jobs: [],
	metadata: [],
	package: {},
};

describe("producePreset", () => {
	describe("passed options", () => {
		const schemaWithOption = createSchema({
			options: {
				value: z.string(),
			},
		});

		const blockUsingOption = schemaWithOption.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		const presetUsingOption = schemaWithOption.createPreset({
			blocks: [blockUsingOption()],
		});

		it("passes options to the preset when provided via options", async () => {
			const actual = await producePreset(presetUsingOption, {
				options: {
					value: "abc",
				},
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value.txt": "abc",
				},
			});
		});

		it("passes options to the preset when provided via optionsAugment", async () => {
			const actual = await producePreset(presetUsingOption, {
				optionsAugment: () => ({
					value: "abc",
				}),
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value.txt": "abc",
				},
			});
		});

		it("passes options to the preset when provided via options and  optionsAugment", async () => {
			const actual = await producePreset(presetUsingOption, {
				options: {
					value: "abc",
				},
				optionsAugment: (existing) => ({
					value: [existing.value, "def"].join("-"),
				}),
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value.txt": "abc-def",
				},
			});
		});
	});

	describe("directly produced options", () => {
		const schemaWithProduce = createSchema({
			options: {
				optional: z.string().optional(),
				required: z.string(),
			},
			produce() {
				return {
					optional: "optional-from-produce",
					required: "required-from-produce",
				};
			},
		});

		const blockUsingOption = schemaWithProduce.createBlock({
			produce({ options }) {
				return {
					files: {
						"value-optional.txt": options.optional,
						"value-required.txt": options.required,
					},
				};
			},
		});

		const presetUsingOption = schemaWithProduce.createPreset({
			blocks: [blockUsingOption()],
		});

		it("prioritizes provided options over schema produced options", async () => {
			const actual = await producePreset(presetUsingOption, {
				options: {
					required: "required-from-provided",
				},
			});

			expect(actual).toEqual({
				...emptyCreation,
				files: {
					"value-optional.txt": "optional-from-produce",
					"value-required.txt": "required-from-provided",
				},
			});
		});
	});

	describe("system", () => {
		const schemaWithOption = createSchema({
			options: {
				value: z.string(),
			},
		});

		describe("fetcher", () => {
			const inputFetcher = createInput({
				args: {
					text: z.string(),
				},
				async produce({ args, fetcher }) {
					return (await fetcher(args.text)).text();
				},
			});

			type InputArgs = InputArgsFor<typeof inputFetcher>;

			const blockUsingFetcher = schemaWithOption.createBlock({
				async produce({ options, take }) {
					return {
						files: {
							"value.txt": await take(inputFetcher, { text: options.value }),
						},
					};
				},
			});

			const presetUsingFetcher = schemaWithOption.createPreset({
				blocks: [blockUsingFetcher()],
			});

			it("uses the provided take when it exists", async () => {
				const take = vi.fn((_: unknown, args: InputArgs) => {
					return args.text + "-def";
				}) as TakeInput;

				const actual = await producePreset(presetUsingFetcher, {
					options: {
						value: "abc",
					},
					system: { take },
				});

				expect(actual).toEqual({
					...emptyCreation,
					files: {
						"value.txt": "abc-def",
					},
				});
			});

			it("uses the provided fetcher and default take when only fetcher is provided", async () => {
				const fetcher = vi
					.fn()
					.mockResolvedValueOnce({ text: () => Promise.resolve("def") });

				const actual = await producePreset(presetUsingFetcher, {
					options: {
						value: "abc",
					},
					system: { fetcher },
				});

				expect(actual).toEqual({
					...emptyCreation,
					files: {
						"value.txt": "def",
					},
				});
				expect(fetcher).toHaveBeenCalledWith("abc");
			});
		});
	});
});
