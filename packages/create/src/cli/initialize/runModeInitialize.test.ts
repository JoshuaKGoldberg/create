import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIMessage } from "../messages.js";
import { CLIStatus } from "../status.js";
import { runModeInitialize } from "./runModeInitialize.js";

const mockCancel = Symbol("cancel");
const mockLog = {
	error: vi.fn(),
	message: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
	get log() {
		return mockLog;
	},
	spinner: vi.fn(),
}));

const mockHelpTextReturn = { outro: CLIMessage.Ok, status: CLIStatus.Success };
const mockLogInitializeHelpText = vi.fn().mockResolvedValue(mockHelpTextReturn);

vi.mock("../loggers/logInitializeHelpText.js", () => ({
	get logInitializeHelpText() {
		return mockLogInitializeHelpText;
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

vi.mock("../../system/createSystemContextWithAuth.js", () => ({
	createSystemContextWithAuth: vi.fn().mockResolvedValue({
		fetchers: {},
	}),
}));

vi.mock("../createInitialCommit.js", () => ({
	createInitialCommit: vi.fn(),
}));

vi.mock("../clearLocalGitTags.js", () => ({
	clearLocalGitTags: vi.fn(),
}));

const mockTryImportTemplatePreset = vi.fn();

vi.mock("../importers/tryImportTemplatePreset.js", () => ({
	get tryImportTemplatePreset() {
		return mockTryImportTemplatePreset;
	},
}));

const mockApplyArgsToSettings = vi.fn();

vi.mock("../parsers/applyArgsToSettings", () => ({
	get applyArgsToSettings() {
		return mockApplyArgsToSettings;
	},
}));

const mockPromptForBaseOptions = vi.fn();

vi.mock("../prompts/promptForBaseOptions.js", () => ({
	get promptForBaseOptions() {
		return mockPromptForBaseOptions;
	},
}));

const mockPromptForDirectory = vi.fn();

vi.mock("../prompts/promptForDirectory.js", () => ({
	get promptForDirectory() {
		return mockPromptForDirectory;
	},
}));

const mockCreateRepositoryOnGitHub = vi.fn();

vi.mock("./createRepositoryOnGitHub.js", () => ({
	get createRepositoryOnGitHub() {
		return mockCreateRepositoryOnGitHub;
	},
}));

vi.mock("./createTrackingBranches.js", () => ({
	createTrackingBranches: vi.fn(),
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
});

const preset = base.createPreset({
	about: { name: "Test" },
	blocks: [],
});

const template = base.createTemplate({
	presets: [preset],
});

const args = ["create-my-app"];

const promptedOptions = {
	abc: "def",
};

describe("runModeInitialize", () => {
	it("logs help text when from is undefined", async () => {
		const actual = await runModeInitialize({
			args: ["node", "create"],
			display,
		});

		expect(mockLogInitializeHelpText).toHaveBeenCalled();

		expect(actual).toBe(mockHelpTextReturn);
	});

	it("logs help text when from help is true", async () => {
		const actual = await runModeInitialize({
			args: ["node", "create"],
			display,
			from: "create-typescript-app",
			help: true,
		});

		expect(mockLogInitializeHelpText).toHaveBeenCalledWith(
			"create-typescript-app",
			{ help: true, yes: undefined },
		);

		expect(actual).toBe(mockHelpTextReturn);
	});

	it("logs help text with yes when from help is true and yes is true", async () => {
		const actual = await runModeInitialize({
			args: ["node", "create"],
			display,
			from: "create-typescript-app",
			help: true,
			yes: true,
		});

		expect(mockLogInitializeHelpText).toHaveBeenCalledWith(
			"create-typescript-app",
			{ help: true, yes: true },
		);

		expect(actual).toBe(mockHelpTextReturn);
	});

	it("returns the error when importing tryImportTemplatePreset resolves with an error", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce(new Error("Oh no!"));

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({
			outro: CLIMessage.Exiting,
			status: CLIStatus.Error,
		});
	});

	it("returns the cancellation when tryImportTemplatePreset is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce(mockCancel);

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForDirectory is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(mockCancel);

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForBaseOptions is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(".");

		mockPromptForBaseOptions.mockResolvedValueOnce({
			cancelled: true,
			prompted: promptedOptions,
		});

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("returns an error when applyArgsToSettings returns an error", async () => {
		const message = "Oh no!";

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(".");
		mockPromptForBaseOptions.mockResolvedValueOnce({
			completed: {
				owner: "TestOwner",
				repository: "test-repository",
			},
			prompted: promptedOptions,
		});
		mockApplyArgsToSettings.mockReturnValueOnce(new Error(message));

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({
			outro: message,
			status: CLIStatus.Error,
		});

		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("runs createRepositoryOnGitHub when offline is falsy", async () => {
		const directory = "local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			completed: {
				owner: "TestOwner",
				repository: "test-repository",
			},
			prompted: promptedOptions,
		});
		mockRunTemplate.mockResolvedValueOnce({
			suggestions,
		});

		await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(mockCreateRepositoryOnGitHub).toHaveBeenCalled();
		expect(mockLog.message.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --initialize using the template:
			  create-my-app",
			  ],
			  [
			    "Great, you've got a new repository ready to use in:
			  ./local-directory

			It's also pushed to GitHub on:
			  https://github.com/TestOwner/test-repository",
			  ],
			]
		`);
	});

	it("doesn't run createRepositoryOnGitHub when offline is truthy", async () => {
		const directory = "local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			completed: {
				owner: "TestOwner",
				repository: "test-repository",
			},
			prompted: promptedOptions,
		});
		mockRunTemplate.mockResolvedValueOnce({
			suggestions,
		});

		await runModeInitialize({
			args,
			display,
			from: "create-my-app",
			offline: true,
		});

		expect(mockCreateRepositoryOnGitHub).not.toHaveBeenCalled();
		expect(mockLog.message.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --initialize using the template:
			  create-my-app",
			  ],
			  [
			    "--offline enabled. You'll need to git push any changes manually.",
			  ],
			  [
			    "Great, you've got a new repository ready to use in:
			  ./local-directory",
			  ],
			]
		`);
	});

	it("returns a CLI error when running the Preset rejects", async () => {
		const directory = "local-directory";

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			completed: {
				owner: "TestOwner",
				repository: "test-repository",
			},
			prompted: promptedOptions,
		});
		mockRunTemplate.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({
			outro: `Leaving changes to the local directory on disk. 👋`,
			status: CLIStatus.Error,
		});

		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
	});

	it("returns a CLI success and makes an absolute directory relative when importing and running the preset succeeds", async () => {
		const directory = "local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			completed: {
				owner: "TestOwner",
				repository: "test-repository",
			},
			prompted: promptedOptions,
		});
		mockRunTemplate.mockResolvedValueOnce({
			suggestions,
		});

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({
			outro: "Thanks for using create! 💝",
			status: CLIStatus.Success,
			suggestions,
		});

		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
		expect(mockRunTemplate).toHaveBeenCalledWith(
			template,
			expect.objectContaining({ mode: "initialize", preset }),
		);
	});

	it("returns a CLI success and keeps a relative directory when importing and running the preset succeeds", async () => {
		const directory = "./local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			completed: {
				owner: "TestOwner",
				repository: "test-repository",
			},
			prompted: promptedOptions,
		});
		mockRunTemplate.mockResolvedValueOnce({
			suggestions,
		});

		const actual = await runModeInitialize({
			args,
			display,
			from: "create-my-app",
		});

		expect(actual).toEqual({
			outro: "Thanks for using create! 💝",
			status: CLIStatus.Success,
			suggestions,
		});

		expect(mockLogRerunSuggestion).toHaveBeenCalledWith(args, promptedOptions);
		expect(mockRunTemplate).toHaveBeenCalledWith(
			template,
			expect.objectContaining({ mode: "initialize", preset }),
		);
	});
});
