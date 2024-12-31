import { describe, expect, it, vi } from "vitest";

import { tryLoadMigrationPreset } from "./tryLoadMigrationPreset.js";

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

describe("tryLoadMigrationPreset", () => {
	it("returns a CLI error when configFile and from are undefined", async () => {
		const actual = await tryLoadMigrationPreset({
			configFile: undefined,
			directory: ".",
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
		const actual = await tryLoadMigrationPreset({
			configFile: "create.config.js",
			directory: ".",
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

		const actual = await tryLoadMigrationPreset({
			configFile: "create.config.js",
			directory: ".",
		});

		expect(actual).toBe(expected);
		expect(mockTryImportTemplatePreset).not.toHaveBeenCalled();
	});

	it("returns the result from tryImportConfig when only from is specified", async () => {
		const expected = { configFile: true };

		mockTryImportTemplatePreset.mockResolvedValueOnce(expected);

		const actual = await tryLoadMigrationPreset({
			directory: ".",
			from: "my-app",
		});

		expect(actual).toBe(expected);
		expect(mockTryImportConfig).not.toHaveBeenCalled();
	});
});
