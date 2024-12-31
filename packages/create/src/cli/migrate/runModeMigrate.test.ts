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

const mockClearLocalGitTags = vi.fn();

vi.mock("./clearLocalGitTags.js", () => ({
	get clearLocalGitTags() {
		return mockClearLocalGitTags;
	},
}));

const mockClearTemplateFiles = vi.fn();

vi.mock("./clearTemplateFiles.js", () => ({
	get clearTemplateFiles() {
		return mockClearTemplateFiles;
	},
}));

const mockIsForkOfTemplate = vi.fn();

vi.mock("./isForkOfTemplate.js", () => ({
	get isForkOfTemplate() {
		return mockIsForkOfTemplate;
	},
}));

const mockLoadMigrationPreset = vi.fn();

vi.mock("./loadMigrationPreset.js", () => ({
	get loadMigrationPreset() {
		return mockLoadMigrationPreset;
	},
}));

const base = createBase({
	options: {},
});
const preset = base.createPreset({
	about: { name: "Test" },
	blocks: [],
});

describe("runModeMigrate", () => {
	it("returns the error when loadMigrationPreset resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockLoadMigrationPreset.mockResolvedValueOnce(error);

		const actual = await runModeMigrate({
			args: [],
			configFile: undefined,
		});

		expect(actual).toEqual({
			outro: error.message,
			status: CLIStatus.Error,
		});
	});

	it("returns a cancellation status when loadMigrationPreset resolves with an error", async () => {
		mockLoadMigrationPreset.mockResolvedValueOnce({});
		mockIsCancel.mockReturnValueOnce(true);

		const actual = await runModeMigrate({
			args: [],
			configFile: undefined,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
	});

	it("doesn't clear template files or tags when not a template fork", async () => {
		mockLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);
		mockIsForkOfTemplate.mockResolvedValueOnce(false);

		await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockClearTemplateFiles).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
	});

	it("clears template files and tags when a template fork", async () => {
		mockLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);
		mockIsForkOfTemplate.mockResolvedValueOnce(true);

		await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockClearTemplateFiles).not.toHaveBeenCalled();
		expect(mockClearLocalGitTags).not.toHaveBeenCalled();
	});

	it("returns a CLI success when importing and running the preset succeeds", async () => {
		mockLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);

		const actual = await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
		expect(actual).toEqual({
			outro: `You might want to commit any changes.`,
			status: CLIStatus.Success,
		});
	});
});
