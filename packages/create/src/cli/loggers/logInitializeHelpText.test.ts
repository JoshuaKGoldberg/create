import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { logInitializeHelpText } from "./logInitializeHelpText.js";

const mockCancel = Symbol("");
const mockIsCancel = (value: unknown) => value === mockCancel;
const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
};

const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
	get log() {
		return { message: mockMessage };
	},
	spinner: () => mockSpinner,
}));

const mockTryImportTemplate = vi.fn();

vi.mock("../importers/tryImportTemplate.js", () => ({
	get tryImportTemplate() {
		return mockTryImportTemplate;
	},
}));

const mockLogHelpText = vi.fn();

vi.mock("./logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

const mockLogSchemasHelpOptions = vi.fn();

vi.mock("./logSchemasHelpOptions.js", () => ({
	get logSchemasHelpOptions() {
		return mockLogSchemasHelpOptions;
	},
}));

describe("logInitializeHelpText", () => {
	it("logs a straightforward message without loading when from is undefined and help is falsy", async () => {
		const actual = await logInitializeHelpText(undefined, false);

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockMessage).toHaveBeenCalledWith(
			[
				`Try it out with:`,
				`  ${chalk.green("npx create typescript-app")}`,
			].join("\n"),
		);
		expect(mockLogHelpText).not.toHaveBeenCalled();
		expect(mockSpinner.start).not.toHaveBeenCalled();
	});

	it("logs general help text without loading when from is undefined and help is true", async () => {
		const actual = await logInitializeHelpText(undefined, true);

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("initialize");
		expect(mockSpinner.start).not.toHaveBeenCalled();
	});

	it("returns the error when help is falsy and loading the template is an error", async () => {
		const message = "Oh no!";
		const from = "create-my-app";

		mockTryImportTemplate.mockResolvedValueOnce(new Error(message));

		const actual = await logInitializeHelpText(from, false);

		expect(actual).toEqual({
			outro: chalk.red(CLIMessage.Exiting),
			status: CLIStatus.Error,
		});
		expect(mockSpinner.stop).toHaveBeenCalledWith(
			`Could not load ${from}: ${message}.`,
			1,
		);
	});

	it("returns a success when help is falsy and loading the template succeeds", async () => {
		const from = "create-my-app";
		const base = createBase({ options: {} });
		const template = base.createTemplate({
			presets: [],
		});

		mockTryImportTemplate.mockResolvedValueOnce(template);

		const actual = await logInitializeHelpText(from, false);

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockSpinner.stop).toHaveBeenCalledWith(`Loaded ${from}`);
		expect(mockLogSchemasHelpOptions).toHaveBeenCalledWith(
			from,
			template.options,
		);
	});
});
