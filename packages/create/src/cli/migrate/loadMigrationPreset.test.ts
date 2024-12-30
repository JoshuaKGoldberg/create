import { describe, expect, it, vi } from "vitest";

import { loadMigrationPreset } from "./loadMigrationPreset.js";

const mockTryImportConfig = vi.fn();

vi.mock("../../config/tryImportConfig.js", () => ({
	get tryImportConfig() {
		return mockTryImportConfig;
	},
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

describe("loadMigrationPreset", () => {
	it("returns a CLI error when configFile and from are undefined", async () => {
		const actual = await loadMigrationPreset({
			configFile: undefined,
		});

		expect(actual).toEqual(
			new Error(
				"--mode migrate requires either a config file exist or a template be specified on the CLI.",
			),
		);

		expect(mockTryImportConfig).not.toHaveBeenCalled();
		expect(mockTryImportTemplatePreset).not.toHaveBeenCalled();
	});

	it("returns a CLI error when configFile and from are both defined", async () => {
		const actual = await loadMigrationPreset({
			configFile: "create.config.js",
			from: "my-app",
		});

		expect(actual).toEqual(
			new Error(
				"--mode migrate requires either a config file or a specified template, but not both.",
			),
		);

		expect(mockTryImportConfig).not.toHaveBeenCalled();
		expect(mockTryImportTemplatePreset).not.toHaveBeenCalled();
	});

	it("returns the result from tryImportConfig when only configFile is specified", async () => {
		const expected = { configFile: true };

		mockTryImportConfig.mockResolvedValueOnce(expected);

		const actual = await loadMigrationPreset({
			configFile: "create.config.js",
		});

		expect(actual).toBe(expected);
		expect(mockTryImportTemplatePreset).not.toHaveBeenCalled();
	});

	it("returns the result from tryImportConfig when only from is specified", async () => {
		const expected = { configFile: true };

		mockTryImportTemplatePreset.mockResolvedValueOnce(expected);

		const actual = await loadMigrationPreset({
			from: "my-appcreate",
		});

		expect(actual).toBe(expected);
		expect(mockTryImportConfig).not.toHaveBeenCalled();
	});
});