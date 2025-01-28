import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { CLIMessage } from "../messages.js";
import { MigrationSource } from "../migrate/parseMigrationSource.js";
import { CLIStatus } from "../status.js";
import { logMigrateHelpText } from "./logMigrateHelpText.js";

const mockCancel = Symbol("cancel");
const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	spinner: () => mockSpinner,
}));

const mockLogHelpText = vi.fn();

vi.mock("./logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

describe("logMigrateHelpText", () => {
	it("returns a CLI error without spinning when source is an error", async () => {
		const source = new Error("Oh no!");

		const actual = await logMigrateHelpText(source);

		expect(actual).toEqual({
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("migrate", source);
	});

	it("returns the error when source.load resolves with an error", async () => {
		const descriptor = "create-test-app";
		const message = "Oh no!";
		const source: MigrationSource = {
			descriptor,
			load: () => Promise.resolve(new Error(message)),
			type: "template",
		};

		const actual = await logMigrateHelpText(source);

		expect(actual).toEqual({
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("migrate", source);
		expect(mockSpinner.stop).toHaveBeenCalledWith(
			`Could not load ${chalk.blue(descriptor)}: ${chalk.red(message)}`,
			1,
		);
	});

	it("returns the cancellation when source.load is cancelled", async () => {
		const source: MigrationSource = {
			descriptor: "create-test-app",
			load: () => Promise.resolve(mockCancel),
			type: "template",
		};

		const actual = await logMigrateHelpText(source);

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
		expect(mockSpinner.stop).not.toHaveBeenCalled();
	});

	it("returns a success when source.load resolves with a config", async () => {
		const base = createBase({ options: {} });
		const name = "Test Preset";
		const preset = base.createPreset({
			about: { name },
			blocks: [],
		});
		const template = base.createTemplate({ presets: [preset] });
		const descriptor = "create-test-app";
		const source: MigrationSource = {
			descriptor,
			load: () => Promise.resolve({ preset, template }),
			type: "template",
		};

		const actual = await logMigrateHelpText(source);

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockSpinner.stop).toHaveBeenCalledWith(
			`Loaded ${chalk.blue(descriptor)}, which utilizes the ${chalk.red(name)} preset`,
		);
	});
});
