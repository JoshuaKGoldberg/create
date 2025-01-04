import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { createTemplate } from "../../creators/createTemplate.js";
import { CLIStatus } from "../status.js";
import { runModeInitialize } from "./runModeInitialize.js";

const mockCancel = Symbol("");
const mockIsCancel = (value: unknown) => value === mockCancel;
const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
	log: {
		get message() {
			return mockMessage;
		},
	},
	spinner: vi.fn(),
}));

const mockRunPreset = vi.fn();

vi.mock("../../runners/runPreset.js", () => ({
	get runPreset() {
		return mockRunPreset;
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

vi.mock("../display/createClackDisplay.js", () => ({
	createClackDisplay: () => ({
		spinner: {
			start: vi.fn(),
			stop: vi.fn(),
		},
	}),
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

const base = createBase({
	options: {},
});

const preset = base.createPreset({
	about: { name: "Test" },
	blocks: [],
});

const template = createTemplate({
	presets: [],
});

describe("runModeInitialize", () => {
	it("returns an error when there is no from", async () => {
		const actual = await runModeInitialize({
			args: ["node", "create"],
		});

		expect(actual).toEqual({
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		});
	});

	it("returns the error when importing tryImportTemplatePreset resolves with an error", async () => {
		const message = "Oh no!";

		mockTryImportTemplatePreset.mockResolvedValueOnce(new Error(message));

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({
			outro: message,
			status: CLIStatus.Error,
		});
	});

	it("returns the cancellation when tryImportTemplatePreset is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce(mockCancel);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForDirectory is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(mockCancel);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForBaseOptions is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(".");
		mockPromptForBaseOptions.mockResolvedValueOnce(mockCancel);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the error when applyArgsToSettings returns an error", async () => {
		const message = "Oh no!";

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(".");
		mockPromptForBaseOptions.mockResolvedValueOnce({
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockApplyArgsToSettings.mockReturnValueOnce(new Error(message));

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({ outro: message, status: CLIStatus.Error });
	});

	it("runs createRepositoryOnGitHub when offline is falsy", async () => {
		const directory = "local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockRunPreset.mockResolvedValueOnce({
			suggestions,
		});

		await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(mockCreateRepositoryOnGitHub).toHaveBeenCalled();
		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --create for a new repository using the template:
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
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockRunPreset.mockResolvedValueOnce({
			suggestions,
		});

		await runModeInitialize({
			args: ["node", "create", "my-app"],
			offline: true,
		});

		expect(mockCreateRepositoryOnGitHub).not.toHaveBeenCalled();
		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --create for a new repository using the template:
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

	it("returns a CLI success and makes an absolute directory relative when importing and running the preset succeeds", async () => {
		const directory = "local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockRunPreset.mockResolvedValueOnce({
			suggestions,
		});

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({
			outro: "Thanks for using create! 💝",
			status: CLIStatus.Success,
			suggestions,
		});
		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
	});

	it("returns a CLI success and keeps a relative directory when importing and running the preset succeeds", async () => {
		const directory = "./local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockRunPreset.mockResolvedValueOnce({
			suggestions,
		});

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({
			outro: "Thanks for using create! 💝",
			status: CLIStatus.Success,
			suggestions,
		});
		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
	});
});
