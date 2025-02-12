import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { logInitializeHelpText } from "./logInitializeHelpText.js";

const mockInfo = vi.fn();
const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return { info: mockInfo, message: mockMessage };
	},
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
	it("logs a straightforward message without loading when from is undefined and help is false", async () => {
		const actual = await logInitializeHelpText(undefined, {
			help: false,
			yes: false,
		});

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockMessage).toHaveBeenCalledWith(
			[
				`Try it out with:`,
				`  ${chalk.green("npx create typescript-app@beta")}`,
			].join("\n"),
		);
		expect(mockLogHelpText).not.toHaveBeenCalled();
	});

	it("logs general help text without loading when from is undefined and help is true", async () => {
		const actual = await logInitializeHelpText(undefined, {
			help: true,
			yes: false,
		});

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockLogHelpText).toHaveBeenCalledWith("initialize");
	});

	it("returns the error when help is false and loading the template is an error", async () => {
		const message = "Oh no!";
		const from = "create-my-app";

		mockTryImportTemplate.mockResolvedValueOnce(new Error(message));

		const actual = await logInitializeHelpText(from, {
			help: false,
			yes: false,
		});

		expect(actual).toEqual({
			outro: chalk.red(CLIMessage.Exiting),
			status: CLIStatus.Error,
		});
	});

	it("returns a success when help is false and loading the template succeeds", async () => {
		const from = "create-my-app";
		const base = createBase({ options: {} });
		const template = base.createTemplate({
			presets: [],
		});

		mockTryImportTemplate.mockResolvedValueOnce(template);

		const actual = await logInitializeHelpText(from, {
			help: false,
			yes: false,
		});

		expect(actual).toEqual({
			outro: CLIMessage.Ok,
			status: CLIStatus.Success,
		});
		expect(mockLogSchemasHelpOptions).toHaveBeenCalledWith(
			from,
			template.options,
		);
	});
});
