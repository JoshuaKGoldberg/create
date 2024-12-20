import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { produceBase } from "./produceBase.js";

describe("produceBase", () => {
	it("returns settings.options directly when the Base does not have a produce()", async () => {
		const baseWithNoProduce = createBase({
			options: {
				value: z.string().optional(),
			},
		});

		const options = { value: "input" };
		const actual = await produceBase(baseWithNoProduce, { options });

		expect(actual).toEqual(options);
	});

	describe("produce", () => {
		const baseWithOptionalOption = createBase({
			options: {
				value: z.string().optional(),
			},
			produce({ options }) {
				return {
					value: options.value ?? "default",
				};
			},
		});

		it("uses an option value from produce when settings do not have options", async () => {
			const actual = await produceBase(baseWithOptionalOption);

			expect(actual).toEqual({
				value: "default",
			});
		});

		it("uses an option value from produce when settings do not have the options value", async () => {
			const actual = await produceBase(baseWithOptionalOption, {
				options: {},
			});

			expect(actual).toEqual({
				value: "default",
			});
		});

		it("uses an option value from settings when settings have the options value", async () => {
			const actual = await produceBase(baseWithOptionalOption, {
				options: {
					value: "override",
				},
			});

			expect(actual).toEqual({
				value: "override",
			});
		});
	});
});
