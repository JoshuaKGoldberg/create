import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createBase } from "../creators/createBase.js";
import { produceBase } from "./produceBase.js";

describe("producePreset", () => {
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
