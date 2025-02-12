import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { promptForPreset } from "./promptForPreset.js";

const base = createBase({
	options: {},
});

const presetA = base.createPreset({
	about: { name: "A" },
	blocks: [],
});

const presetB = base.createPreset({
	about: { description: "b-description", name: "B" },
	blocks: [],
});

const template = base.createTemplate({
	about: { name: "Test" },
	presets: [presetA, presetB],
	suggested: presetA,
});

const mockError = vi.fn();
const mockSelect = vi.fn().mockResolvedValue(presetB);

vi.mock("@clack/prompts", () => ({
	log: {
		get error() {
			return mockError;
		},
	},
	get select() {
		return mockSelect;
	},
}));

describe("promptForPreset", () => {
	it("returns a requested preset when it exists under the same name", async () => {
		const actual = await promptForPreset("A", template);

		expect(actual).toBe(presetA);
		expect(mockError).not.toHaveBeenCalled();
	});

	it("returns a requested preset when it exists under the lowercase name", async () => {
		const actual = await promptForPreset("a", template);

		expect(actual).toBe(presetA);
		expect(mockError).not.toHaveBeenCalled();
	});

	it("logs an error and prompts for a preset when the requested preset does not exist", async () => {
		const actual = await promptForPreset("c", template);

		expect(actual).toBe(presetB);
		expect(mockError).toHaveBeenCalledWith(`c is not one of: a, b`);
		expect(mockSelect).toHaveBeenCalledWith({
			initialValue: presetA,
			message: "Which --preset would you like to create with?",
			options: [
				{ label: chalk.bold("A"), value: presetA },
				{ label: `${chalk.bold("B")} b-description`, value: presetB },
			],
		});
	});

	it("prompts for a preset without a description without logging an error when no preset is requested", async () => {
		const actual = await promptForPreset(undefined, template);

		expect(actual).toBe(presetB);
		expect(mockError).not.toHaveBeenCalled();
		expect(mockSelect).toHaveBeenCalledWith({
			initialValue: presetA,
			message: "Which --preset would you like to create with?",
			options: [
				{ label: chalk.bold("A"), value: presetA },
				{ label: `${chalk.bold("B")} b-description`, value: presetB },
			],
		});
	});
});
