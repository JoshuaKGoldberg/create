import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { runModeTransition } from "./runModeTransition.js";

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

const mockRunTemplate = vi.fn();

vi.mock("../../runners/runTemplate.js", () => ({
	get runTemplate() {
		return mockRunTemplate;
	},
}));

const mockSystem = {
	runner: vi.fn(),
};

vi.mock("../../contexts/createSystemContextWithAuth.js", () => ({
	get createSystemContextWithAuth() {
		return vi.fn().mockResolvedValue(mockSystem);
	},
}));

const mockPromptForOptions = vi.fn();

vi.mock("../prompts/promptForOptions.js", () => ({
	get promptForOptions() {
		return mockPromptForOptions;
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

const mockLogTransitionHelpText = vi.fn();

vi.mock("../loggers/logTransitionHelpText.js", () => ({
	get logTransitionHelpText() {
		return mockLogTransitionHelpText;
	},
}));

const mockLogRerunSuggestion = vi.fn();

vi.mock("../loggers/logRerunSuggestion.js", () => ({
	get logRerunSuggestion() {
		return mockLogRerunSuggestion;
	},
}));

const mockLogStartText = vi.fn();

vi.mock("../loggers/logStartText", () => ({
	get logStartText() {
		return mockLogStartText;
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

const mockParseTransitionSource = vi.fn();

vi.mock("./parseTransitionSource.js", () => ({
	get parseTransitionSource() {
		return mockParseTransitionSource;
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

const template = createTemplate({
	about: { name: "Test Template" },
	options: {},
	produce: vi.fn(),
});

const templateWithRepository = createTemplate({
	about: { name: "Test Template", repository: { owner: "a", repository: "b" } },
	options: {},
	produce: vi.fn(),
});

const args = ["bingo-my-app"];

const descriptor = "Test Source";
const type = "template";

const source = {
	descriptor,
	load: () => Promise.resolve(template),
	type,
};

const sourceWithRepository = {
	descriptor,
	load: () => Promise.resolve(templateWithRepository),
	type,
};

const promptedOptions = {
	abc: "def",
};

describe("runModeTransition", () => {
	it("logs help text instead of running when help is true", async () => {
		mockParseTransitionSource.mockReturnValueOnce(source);

		await runModeTransition({
			args,
			configFile: undefined,
			display,
			help: true,
		});

		expect(mockLogTransitionHelpText).toHaveBeenCalledWith(source);
		expect(mockLogStartText).not.toHaveBeenCalled();
	});

	it("returns the error when parseTransitionSource returns an error", async () => {
		const error = new Error("Oh no!");

		mockParseTransitionSource.mockReturnValueOnce(error);

		const actual = await runModeTransition({
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

		mockParseTransitionSource.mockReturnValueOnce({
			load: () => Promise.resolve(error),
		});

		const actual = await runModeTransition({
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
		mockParseTransitionSource.mockReturnValueOnce({
			load: () => Promise.resolve(mockCancel),
		});

		const actual = await runModeTransition({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
	});

	it("returns the cancellation when promptForOptions is cancelled", async () => {
		mockParseTransitionSource.mockReturnValueOnce(source);
		mockPromptForOptions.mockResolvedValueOnce({
			cancelled: true,
			prompted: promptedOptions,
		});

		const actual = await runModeTransition({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("returns the error when runTemplate resolves with an error", async () => {
		mockParseTransitionSource.mockReturnValueOnce(source);
		mockPromptForOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockRunTemplate.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await runModeTransition({
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

	it("doesn't clear the existing repository when the template does not have a repository locator", async () => {
		mockParseTransitionSource.mockReturnValueOnce(source);
		mockPromptForOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});

		const actual = await runModeTransition({
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

	it("clears the existing repository online when a forked repository locator is available and offline is falsy", async () => {
		const descriptor = "Test Source";
		const type = "template";

		mockParseTransitionSource.mockReturnValueOnce(sourceWithRepository);
		mockPromptForOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce({
			owner: "",
			repository: "",
		});

		const actual = await runModeTransition({
			args,
			configFile: undefined,
			display,
		});

		expect(actual).toEqual({
			outro: "Done. Enjoy your new repository! 💝",
			status: CLIStatus.Success,
		});
		expect(mockLogStartText).toHaveBeenCalledWith(
			"transition",
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

	it("clears the existing repository offline when a forked repository locator is available and offline is true", async () => {
		const descriptor = "Test Source";
		const type = "template";

		mockParseTransitionSource.mockReturnValueOnce(sourceWithRepository);
		mockPromptForOptions.mockResolvedValueOnce({
			prompted: promptedOptions,
		});
		mockGetForkedRepositoryLocator.mockResolvedValueOnce({
			owner: "",
			repository: "",
		});

		const actual = await runModeTransition({
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
			"transition",
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
