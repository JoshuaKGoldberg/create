import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { CLIStatus } from "../status.js";
import { runModeMigrate } from "./runModeMigrate.js";

const mockIsCancel = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
	log: {
		message: vi.fn(),
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
	createSystemContextWithAuth: vi.fn().mockResolvedValue({}),
}));

vi.mock("../display/createClackDisplay.js", () => ({
	createClackDisplay: () => ({
		spinner: {
			start: vi.fn(),
			stop: vi.fn(),
		},
	}),
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

const mockClearTemplateFiles = vi.fn();

vi.mock("./clearTemplateFiles.js", () => ({
	get clearTemplateFiles() {
		return mockClearTemplateFiles;
	},
}));

const mockGetForkedTemplateLocator = vi.fn();

vi.mock("./getForkedTemplateLocator.js", () => ({
	get getForkedTemplateLocator() {
		return mockGetForkedTemplateLocator;
	},
}));

const mockTryLoadMigrationPreset = vi.fn();

vi.mock("./tryLoadMigrationPreset.js", () => ({
	get tryLoadMigrationPreset() {
		return mockTryLoadMigrationPreset;
	},
}));

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

describe("runModeMigrate", () => {
	it("returns the error when tryLoadMigrationPreset resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockTryLoadMigrationPreset.mockResolvedValueOnce(error);

		const actual = await runModeMigrate({
			args: [],
			configFile: undefined,
		});

		expect(actual).toEqual({
			outro: error.message,
			status: CLIStatus.Error,
		});
	});

	it("returns a cancellation status when tryLoadMigrationPreset resolves with an error", async () => {
		mockTryLoadMigrationPreset.mockResolvedValueOnce({});
		mockIsCancel.mockReturnValueOnce(true);

		const actual = await runModeMigrate({
			args: [],
			configFile: undefined,
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForBaseOptions is cancelled", async () => {
		mockTryLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false).mockReturnValueOnce(true);
		mockGetForkedTemplateLocator.mockResolvedValueOnce(undefined);
		mockPromptForBaseOptions.mockResolvedValueOnce(Symbol.for("cancel"));

		const actual = await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockClearTemplateFiles).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("doesn't clear Git or template files when no forked template locator is available", async () => {
		mockTryLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);
		mockGetForkedTemplateLocator.mockResolvedValueOnce(undefined);

		await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockClearTemplateFiles).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
		expect(mockCreateInitialCommit).not.toHaveBeenCalled();
	});

	it("clears Git and template files when a forked template locator is available", async () => {
		mockTryLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);
		mockGetForkedTemplateLocator.mockResolvedValueOnce("a/b");

		await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockClearTemplateFiles).toHaveBeenCalled();
		expect(mockClearLocalGitTags).toHaveBeenCalled();
		expect(mockCreateInitialCommit).toHaveBeenCalled();
	});

	it("returns a CLI success when importing and running the preset succeeds", async () => {
		mockTryLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);

		const actual = await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(actual).toEqual({
			outro: `You might want to commit any changes.`,
			status: CLIStatus.Success,
		});
		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
	});
});
