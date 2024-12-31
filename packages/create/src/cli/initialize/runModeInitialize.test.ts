import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { createTemplate } from "../../creators/createTemplate.js";
import { CLIStatus } from "../status.js";
import { runModeInitialize } from "./runModeInitialize.js";

const mockIsCancel = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
	spinner: vi.fn(),
}));

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
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});

	it("returns the cancellation when promptForInitializationDirectory is cancelled", async () => {
		mockTryImportTemplatePreset.mockResolvedValueOnce({ preset, template });
		mockPromptForInitializationDirectory.mockResolvedValueOnce(Symbol(""));
		mockIsCancel.mockReturnValueOnce(false).mockReturnValueOnce(true);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
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
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});
});
