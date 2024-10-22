import { createInput, createSchema, SchemaContextFor } from "create";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createMockBlockContext } from "./createMockBlockContext.js";

const schema = createSchema({
	options: {
		value: z.string(),
	},
});

describe("createMockBlockContext", () => {
	describe("options", () => {
		const blockUsingOptions = schema.createBlock({
			produce({ options }) {
				return {
					files: {
						"value.txt": options.value,
					},
				};
			},
		});

		it("throws an error when options isn't provided and a block uses options", async () => {
			const context = createMockBlockContext({
				take: vi.fn(),
			});

			await expect(
				async () =>
					await blockUsingOptions().produce(
						context as SchemaContextFor<typeof schema>,
					),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'options' was used by a block but not provided.]`,
			);
		});

		it("passes options to the block when provided", async () => {
			const context = createMockBlockContext({
				options: { value: "abc" },
				take: vi.fn(),
			});

			const actual = await blockUsingOptions().produce(context);

			expect(actual).toEqual({ files: { "value.txt": "abc" } });
		});
	});

	describe("take", () => {
		const inputString = createInput({
			args: {
				value: z.string(),
			},
			produce({ args }) {
				return args.value;
			},
		});

		const blockUsingTake = schema.createBlock({
			produce({ options, take }) {
				return {
					files: {
						"value.txt": take(inputString, { value: options.value }),
					},
				};
			},
		});

		it("throws an error when take isn't provided and a block uses take", async () => {
			const context = createMockBlockContext({
				options: { value: "def" },
			});

			await expect(
				async () => await blockUsingTake().produce(context),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'take' was used by a block but not provided.]`,
			);
		});

		it("passes take to the block when provided", async () => {
			const take = vi.fn().mockReturnValueOnce("def");
			const context = createMockBlockContext({
				options: { value: "abc" },
				take,
			});

			const actual = await blockUsingTake().produce(context);

			expect(actual).toEqual({ files: { "value.txt": "def" } });
			expect(take).toHaveBeenCalledWith(inputString, { value: "abc" });
		});
	});
});
