import { describe, expect, it, vi } from "vitest";

import { createTemplate } from "../../creators/createTemplate.js";
import { tryImportTemplate } from "./tryImportTemplate.js";

const mockTryImportAndInstallIfNecessary = vi.fn();

vi.mock("./tryImportAndInstallIfNecessary.js", () => ({
	get tryImportAndInstallIfNecessary() {
		return mockTryImportAndInstallIfNecessary;
	},
}));

const from = "from";

describe("assertOptionsForInitialize", () => {
	it("returns the error when tryImportAndInstallIfNecessary resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockTryImportAndInstallIfNecessary.mockResolvedValueOnce(error);

		const actual = await tryImportTemplate(from);

		expect(actual).toBe(error);
	});

	it("returns an error when the resolved module doesn't have a default", async () => {
		mockTryImportAndInstallIfNecessary.mockResolvedValueOnce({ named: true });

		const actual = await tryImportTemplate(from);

		expect(actual).toEqual(
			new Error(`${from} should have a default exported Template.`),
		);
	});

	it("returns an error when the resolved module's default is not a template", async () => {
		mockTryImportAndInstallIfNecessary.mockResolvedValueOnce({
			default: "other",
		});

		const actual = await tryImportTemplate(from);

		expect(actual).toEqual(
			new Error(`${from}'s default export should be a Template.`),
		);
	});

	it("returns the template when the resolved module's default is a template", async () => {
		const template = createTemplate({ about: { name: "Test" }, presets: [] });

		mockTryImportAndInstallIfNecessary.mockResolvedValueOnce({
			default: template,
		});

		const actual = await tryImportTemplate(from);

		expect(actual).toBe(template);
	});
});
