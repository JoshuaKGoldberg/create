import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { runModeMigrate } from "./runModeMigrate.js";

const mockLog = {
	error: vi.fn(),
	message: vi.fn(),
};

const mockCancel = Symbol("cancel");

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	get log() {
		return mockLog;
	},
	spinner: vi.fn(),
}));

const mockLogMigrateHelpText = vi.fn();

vi.mock("../loggers/logMigrateHelpText.js", () => ({
	get logMigrateHelpText() {
		return mockLogMigrateHelpText;
	},
}));

const mockLogRerunSuggestion = vi.fn();

vi.mock("../loggers/logRerunSuggestion.js", () => ({
	get logRerunSuggestion() {
		return mockLogRerunSuggestion;
	},
}));

const mockRunTemplate = vi.fn();

vi.mock("../../runners/runTemplate.js", () => ({
	get runTemplate() {
		return mockRunTemplate;
	},
}));

const mockSystem = {
	runner: vi.fn(),
};

vi.mock("../../system/createSystemContextWithAuth.js", () => ({
	get createSystemContextWithAuth() {
		return vi.fn().mockResolvedValue(mockSystem);
	},
}));

const mockPromptForBaseOptions = vi.fn();

vi.mock("../prompts/promptForBaseOptions.js", () => ({
	get promptForBaseOptions() {
		return mockPromptForBaseOptions;
	},
}));

const mockClearLocalGitTags = vi.fn();

vi.mock("../clearLocalGitTags.js", () => ({
	get clearLocalGitTags() {
		return mockClearLocalGitTags;
	},
}));

const mockCreateInitialCommit = vi.fn();

vi.mock("../createInitialCommit.js", () => ({
	get createInitialCommit() {
		return mockCreateInitialCommit;
	},
}));

const mockLogStartText = vi.fn();

vi.mock("../loggers/logStartText", () => ({
	get logStartText() {
		return mockLogStartText;
	},
}));

const mockApplyArgsToSettings = vi.fn();

vi.mock("../parsers/applyArgsToSettings", () => ({
	get applyArgsToSettings() {
		return mockApplyArgsToSettings;
	},
}));

const mockClearTemplateFiles = vi.fn();

vi.mock("./clearTemplateFiles.js", () => ({
	get clearTemplateFiles() {
		return mockClearTemplateFiles;
	},
}));

const mockGetForkedRepositoryLocator = vi.fn();

vi.mock("./getForkedRepositoryLocator.js", () => ({
	get getForkedRepositoryLocator() {
		return mockGetForkedRepositoryLocator;
	},
}));

const mockParseMigrationSource = vi.fn();

vi.mock("./parseMigrationSource.js", () => ({
	get parseMigrationSource() {
		return mockParseMigrationSource;
	},
}));

const display: ClackDisplay = {
	dumpItems: vi.fn(),
	item: vi.fn(),
	log: vi.fn(),
	spinner: {
		message: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
	},
};

const base = createBase({
	options: {},
	template: {
		owner: "TestOwner",
		repository: "test-repository",
	},
});

const preset = base.createPreset({
	about: { name: "Test" },
	blocks: [],
});

const template = base.createTemplate({ presets: [preset] });

const args = ["create-my-app"];

const descriptor = "Test Source";
const type = "template";

const source = {
	descriptor,
	load: () => Promise.resolve({ preset, template }),
	type,
};

const promptedOptions = {
	abc: "def",
};

describe("runModeMigrate", () => {
	it("logs help text instead of running when help is true", async () => {
		mockParseMigrationSource.mockReturnValueOnce(source);

		await runModeMigrate({
			args,
			configFile: undefined,
			display,
			help: true,
		});

		expect(mockLogMigrateHelpText).toHaveBeenCalledWith(source);
		expect(mockLogStartText).not.toHaveBeenCalled();
	});

	it("returns the error when parseMigrationSource returns an error", async () => {
		const error = new Error("Oh no!");

		mockParseMigrationSource.mockReturnValueOnce(error);

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			outro: error.message,
			status: CLIStatus.Error,
		});
	});

	it("returns the error when the loaded source resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockParseMigrationSource.mockReturnValueOnce({
			load: () => Promise.resolve(error),
		});

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			outro: error.message,
			status: CLIStatus.Error,
		});
	});

	it("returns the cancellation when the loaded source is cancelled", async () => {
		mockParseMigrationSource.mockReturnValueOnce({
			load: () => Promise.resolve(mockCancel),
		});

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
	});

	it("returns the cancellation when promptForBaseOptions is cancelled", async () => {
		mockParseMigrationSource.mockReturnValueOnce({
			load: () => Promise.resolve({ preset }),
		});
		mockPromptForBaseOptions.mockResolvedValueOnce({
			cancelled: true,
			prompted: promptedOptions,
		});

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("returns the error when applyArgsToSettings returns an error", async () => {
		const message = "Oh no!";

		mockParseMigrationSource.mockReturnValueOnce({
			load: () => Promise.resolve({ preset }),
		});
		mockPromptForBaseOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce(undefined);
		mockApplyArgsToSettings.mockReturnValueOnce(new Error(message));

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({ outro: message, status: CLIStatus.Error });
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("returns the error when runTemplate resolves with an error", async () => {
		mockParseMigrationSource.mockReturnValueOnce({
			load: () => Promise.resolve({ preset }),
		});
		mockPromptForBaseOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce(undefined);
		mockRunTemplate.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			outro: `Leaving changes to the local directory on disk. 👋`,
			status: CLIStatus.Error,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("doesn't clear the existing repository when no forked template locator is available", async () => {
		mockParseMigrationSource.mockReturnValueOnce({
			load: () => Promise.resolve({ preset }),
		});
		mockPromptForBaseOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce(undefined);

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your updated repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockClearTemplateFiles).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("clears the existing repository online when a forked template locator is available and offline is falsy", async () => {
		const descriptor = "Test Source";
		const type = "template";

		mockParseMigrationSource.mockReturnValueOnce(source);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce({
			owner: "",
			repository: "",
		});

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your new repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockLogStartText).toHaveBeenCalledWith(
			"migrate",
			descriptor,
			type,
			undefined,
		);
		expect(mockClearTemplateFiles).toHaveBeenCalled();
		expect(mockClearLocalGitTags).toHaveBeenCalled();
		expect(mockCreateInitialCommit).toHaveBeenCalledWith(mockSystem.runner, {
			amend: true,
			offline: undefined,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("clears the existing repository offline when a forked template locator is available and offline is true", async () => {
		const descriptor = "Test Source";
		const type = "template";

		mockParseMigrationSource.mockReturnValueOnce(source);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce({
			owner: "",
			repository: "",
		});

		const actual = await runModeMigrate({
			args,
			configFile: undefined,
			display,
			offline: true,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your new repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockLogStartText).toHaveBeenCalledWith(
			"migrate",
			descriptor,
			type,
			true,
		);
		expect(mockClearTemplateFiles).toHaveBeenCalled();
		expect(mockClearLocalGitTags).toHaveBeenCalled();
		expect(mockCreateInitialCommit).toHaveBeenCalledWith(mockSystem.runner, {
			amend: true,
			offline: true,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});
});
