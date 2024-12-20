import { describe, test } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";
import { createTemplate } from "./createTemplate.js";

const base = createBase({
	options: {
		value: z.string(),
	},
});

const presetFirst = base.createPreset({
	about: { name: "First" },
	blocks: [],
});

const presetSecond = base.createPreset({
	about: { name: "Second" },
	blocks: [],
});

describe("createTemplate", () => {
	// We're just testing types, since the template definition === the template
	// eslint-disable-next-line vitest/expect-expect
	test("production with the same Base", () => {
		createTemplate({
			about: {
				name: "TypeScript App",
			},
			presets: [presetFirst, presetSecond],
			suggested: presetFirst,
		});
	});
});
