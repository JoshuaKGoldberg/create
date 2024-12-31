import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { createTemplate } from "../../creators/createTemplate.js";
import { ClackDisplay } from "../display/createClackDisplay.js";
import { CLIStatus } from "../status.js";
import { runModeInitialize } from "./runModeInitialize.js";

const mockIsCancel = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
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

const stubDisplay = {
	dumpItems: vi.fn(),
	item: vi.fn(),
	log: vi.fn(),
	spinner: {
		start: vi.fn(),
		stop: vi.fn(),
	},
} as unknown as ClackDisplay;

const mockTryImportTemplatePreset = vi.fn();

vi.mock("../importers/tryImportTemplatePreset.js", () => ({
	get tryImportTemplatePreset() {
		return mockTryImportTemplatePreset;
	},
}));

const mockPromptForBaseOptions = vi.fn();

vi.mock("../prompts/promptForBaseOptions.js", () => ({
	get promptForBaseOptions() {
		return mockPromptForBaseOptions;
	},
}));

const mockPromptForInitializationDirectory = vi.fn();

vi.mock("../prompts/promptForInitializationDirectory.js", () => ({
	get promptForInitializationDirectory() {
		return mockPromptForInitializationDirectory;
	},
}));

vi.mock("./createRepositoryOnGitHub.js", () => ({
	createRepositoryOnGitHub: vi.fn(),
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
	it("returns the error when importing tryImportTemplatePreset resolves with an error", async () => {
		const message = "Oh no!";

		mockTryImportTemplatePreset.mockResolvedValueOnce(new Error(message));

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
			display: stubDisplay,
		});

		expect(actual).toEqual({
			outro: message,
			status: CLIStatus.Error,
		});
	});

	it("returns the cancellation when tryImportTemplatePreset is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce(Symbol(""));
		mockIsCancel.mockReturnValueOnce(true);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
			display: stubDisplay,
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForInitializationDirectory is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForInitializationDirectory.mockResolvedValueOnce(Symbol(""));
		mockIsCancel.mockReturnValueOnce(false).mockReturnValueOnce(true);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
			display: stubDisplay,
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForBaseOptions is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForInitializationDirectory.mockResolvedValueOnce(".");
		mockPromptForBaseOptions.mockResolvedValueOnce(Symbol(""));
		mockIsCancel
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(true);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
			display: stubDisplay,
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns a CLI success and makes an absolute directory relative when importing and running the preset succeeds", async () => {
		const directory = "local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForInitializationDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockIsCancel.mockReturnValue(false);
		mockRunPreset.mockResolvedValueOnce({
			suggestions,
		});

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
			display: stubDisplay,
		});

		expect(actual).toEqual({
			outro: "Your new repository is ready in: ./local-directory",
			status: CLIStatus.Success,
			suggestions,
		});
		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
	});

	it("returns a CLI success and keeps a relative directory when importing and running the preset succeeds", async () => {
		const directory = "./local-directory";
		const suggestions = ["abc"];

		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForInitializationDirectory.mockResolvedValueOnce(directory);
		mockPromptForBaseOptions.mockResolvedValueOnce({
			owner: "TestOwner",
			repository: "test-repository",
		});
		mockIsCancel.mockReturnValue(false);
		mockRunPreset.mockResolvedValueOnce({
			suggestions,
		});

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
			display: stubDisplay,
		});

		expect(actual).toEqual({
			outro: "Your new repository is ready in: ./local-directory",
			status: CLIStatus.Success,
			suggestions,
		});
		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
	});
});
