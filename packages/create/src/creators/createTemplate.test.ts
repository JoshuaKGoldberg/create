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
	blocks: [],
});

const presetSecond = base.createPreset({
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
			default: "First",
			presets: [
				{ label: "First", preset: presetFirst },
				{ label: "Second", preset: presetSecond },
			],
		});
	});
});
