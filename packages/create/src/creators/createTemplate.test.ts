import { describe, test } from "vitest";
import { z } from "zod";

import { createSchema } from "./createSchema.js";
import { createTemplate } from "./createTemplate.js";

const schema = createSchema({
	options: {
		value: z.string(),
	},
});

const presetFirst = schema.createPreset({
	blocks: [],
});

const presetSecond = schema.createPreset({
	blocks: [],
});

describe("createTemplate", () => {
	// We're just testing types, since the template definition === the template
	// eslint-disable-next-line vitest/expect-expect
	test("production with the same schema", () => {
		createTemplate({
			about: {
				name: "TypeScript App",
			},
			default: "First",
			presets: [
				{ label: "First", preset: presetFirst },
				{ label: "Second", preset: presetSecond },
			],
		});
	});
});
