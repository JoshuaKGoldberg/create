import { describe, expect, it, vi } from "vitest";

import { tryImportTemplatePreset } from "./tryImportTemplatePreset.js";

const mockIsCancel = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
}));

const mockPromptForPreset = vi.fn();

vi.mock("../prompts/promptForPreset.js", () => ({
	get promptForPreset() {
		return mockPromptForPreset;
	},
}));

const mockTryImportWithPredicate = vi.fn();

vi.mock("../tryImportWithPredicate.js", () => ({
	get tryImportWithPredicate() {
		return mockTryImportWithPredicate;
	},
}));

describe("tryImportTemplatePreset", () => {
	it("returns an error when from is undefined", async () => {
		const actual = await tryImportTemplatePreset(undefined);

		expect(actual).toEqual(
			new Error("Please specify a package to create from."),
		);
		expect(mockTryImportWithPredicate).not.toHaveBeenCalled();
	});

	it("returns the error when tryImportWithPredicate resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockTryImportWithPredicate.mockResolvedValueOnce(error);

		const actual = await tryImportTemplatePreset("my-app");

		expect(actual).toEqual(error);
		expect(mockPromptForPreset).not.toHaveBeenCalled();
	});

	it("returns the cancellation when promptForPreset is cancelled", async () => {
		const preset = Symbol.for("cancel");

		mockTryImportWithPredicate.mockResolvedValueOnce({});
		mockPromptForPreset.mockResolvedValueOnce(preset);
		mockIsCancel.mockReturnValueOnce(true);

		const actual = await tryImportTemplatePreset("my-app");

		expect(actual).toBe(preset);
	});

	it("returns the template and preset when promptForPreset resolves with a preset", async () => {
		const template = { isTemplate: true };
		const preset = { isPreset: true };

		mockTryImportWithPredicate.mockResolvedValueOnce(template);
		mockPromptForPreset.mockResolvedValueOnce(preset);
		mockIsCancel.mockReturnValueOnce(false);

		const actual = await tryImportTemplatePreset("my-app");

		expect(actual).toEqual({ preset, template });
	});
});
