import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createSchema } from "../creators/createSchema.js";
import { produceSchema } from "./produceSchema.js";

describe("producePreset", () => {
	const schemaWithOptionalOption = createSchema({
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
		const actual = await produceSchema(schemaWithOptionalOption, {
			options: {},
		});

		expect(actual).toEqual({
			value: "default",
		});
	});

	it("uses an option value from settings when settings have the options value", async () => {
		const actual = await produceSchema(schemaWithOptionalOption, {
			options: {
				value: "override",
			},
		});

		expect(actual).toEqual({
			value: "override",
		});
	});
});
