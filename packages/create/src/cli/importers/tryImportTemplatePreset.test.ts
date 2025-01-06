import { describe, expect, it, vi } from "vitest";

import { tryImportTemplatePreset } from "./tryImportTemplatePreset.js";

const mockCancel = Symbol("cancel");

vi.mock("@clack/prompts", () => ({
	isCancel: (value: unknown) => value === mockCancel,
}));

const mockPromptForPreset = vi.fn();

vi.mock("../prompts/promptForPreset.js", () => ({
	get promptForPreset() {
		return mockPromptForPreset;
	},
}));

const mockTryImportTemplate = vi.fn();

vi.mock("./tryImportTemplate.js", () => ({
	get tryImportTemplate() {
		return mockTryImportTemplate;
	},
}));

describe("tryImportTemplatePreset", () => {
	it("returns the error when tryImportTemplate resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockTryImportTemplate.mockResolvedValueOnce(error);

		const actual = await tryImportTemplatePreset("create-my-app");

		expect(actual).toEqual(error);
		expect(mockPromptForPreset).not.toHaveBeenCalled();
	});

	it("returns the cancellation when promptForPreset is cancelled", async () => {
		mockTryImportTemplate.mockResolvedValueOnce({});
		mockPromptForPreset.mockResolvedValueOnce(mockCancel);

		const actual = await tryImportTemplatePreset("create-my-app");

		expect(actual).toBe(mockCancel);
	});

	it("returns the template and preset when promptForPreset resolves with a preset", async () => {
		const template = { isTemplate: true };
		const preset = { isPreset: true };

		mockTryImportTemplate.mockResolvedValueOnce(template);
		mockPromptForPreset.mockResolvedValueOnce(preset);

		const actual = await tryImportTemplatePreset("create-my-app");

		expect(actual).toEqual({ preset, template });
	});
});
