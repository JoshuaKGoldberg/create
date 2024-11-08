import { createInput, createSchema } from "create";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { testSchema } from "./testSchema.js";

const schemaWithNoProduce = createSchema({
	options: {
		value: z.string(),
	},
});

const schemaWithValueHardcoded = createSchema({
	options: {
		value: z.string(),
	},
	produce() {
		return {
			value: "hardcoded",
		};
	},
});

describe("testSchema", () => {
	it("doesn't throw an error when the schema has no produce and settings isn't provided", async () => {
		const actual = await testSchema(schemaWithNoProduce);

		expect(actual).toEqual(undefined);
	});

	it("doesn't throw an error when the schema has no produce and settings is {}", async () => {
		const actual = await testSchema(schemaWithNoProduce, {});

		expect(actual).toEqual(undefined);
	});

	it("doesn't throw an error when the schema has a produce that does not use settings and settings isn't provided", async () => {
		const actual = await testSchema(schemaWithValueHardcoded);

		expect(actual).toEqual({ value: "hardcoded" });
	});

	it("doesn't throw an error when the schema has a produce that does not use settings and settings is {}", async () => {
		const actual = await testSchema(schemaWithValueHardcoded, {});

		expect(actual).toEqual({ value: "hardcoded" });
	});

	describe("options", () => {
		const schemaWithValueFromOptions = createSchema({
			options: {
				value: z.string(),
			},
			produce({ options }) {
				return {
					value: options.value ?? "default",
				};
			},
		});

		it("returns the options directly when the schema has no produce", async () => {
			const actual = await testSchema(schemaWithNoProduce, {
				options: { value: "direct" },
			});

			expect(actual).toEqual({ value: "direct" });
		});

		it("throws an error when the schema produce uses options and settings does not contain options", async () => {
			await expect(
				async () => await testSchema(schemaWithValueFromOptions, {}),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'options' was used by the schema but not provided.]`,
			);
		});

		it("uses options when the schema produce uses options and settings contains options", async () => {
			const actual = await testSchema(schemaWithValueFromOptions, {
				options: { value: "override" },
			});

			expect(actual).toEqual({ value: "override" });
		});
	});

	describe("take", () => {
		const constant = "abc123";
		const inputConstant = createInput({
			produce: () => constant,
		});

		const schemaWithValueFromInput = createSchema({
			options: {
				value: z.string(),
			},
			produce({ take }) {
				return {
					value: () => take(inputConstant),
				};
			},
		});

		it("throws an error when the schema produce uses take and settings does not include take", async () => {
			await expect(async () =>
				testSchema(schemaWithValueFromInput, { options: { value: "unused" } }),
			).rejects.toMatchInlineSnapshot(
				`[Error: Context property 'take' was used by the schema but not provided.]`,
			);
		});

		it("uses the provide take when the schema produce uses take and settings includes take", async () => {
			const take = vi.fn().mockReturnValueOnce("taken");

			const actual = await testSchema(schemaWithValueFromInput, { take });

			expect(actual).toEqual({ value: "taken" });
			expect(take).toHaveBeenCalledWith(inputConstant);
		});
	});
});
