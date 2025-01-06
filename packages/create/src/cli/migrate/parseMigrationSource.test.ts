import { describe, expect, it, vi } from "vitest";

import {
	MigrationSource,
	parseMigrationSource,
} from "./parseMigrationSource.js";

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

describe("parseMigrationSource", () => {
	it("returns a CLI error when configFile and from are undefined", () => {
		const actual = parseMigrationSource({
			directory: ".",
		});

		expect(actual).toEqual(
			new Error(
				"Existing repository detected. To migrate an existing repository, either create a create.config file or provide the name or path of a template.",
			),
		);
	});

	it("returns a CLI error when configFile and from are both defined", () => {
		const actual = parseMigrationSource({
			configFile: "create.config.js",
			directory: ".",
			from: "my-app",
		});

		expect(actual).toEqual(
			new Error(
				"--mode migrate cannot combine an existing config file (create.config.js) with an explicit --from (my-app).",
			),
		);
	});

	it("returns a config loader when only configFile is defined", async () => {
		const expected = { configFile: true };

		mockTryImportConfig.mockResolvedValueOnce(expected);

		const actual = parseMigrationSource({
			configFile: "create.config.js",
			directory: ".",
		});

		expect(actual).toEqual({
			descriptor: "create.config.js",
			load: expect.any(Function),
			type: "config file",
		});

		const loaded = await (actual as MigrationSource).load();
		expect(loaded).toBe(expected);
		expect(mockTryImportTemplatePreset).not.toHaveBeenCalled();
	});

	it("returns a template loader when only from is defined", async () => {
		const expected = { configFile: true };

		mockTryImportTemplatePreset.mockResolvedValueOnce(expected);

		const actual = parseMigrationSource({
			directory: ".",
			from: "my-app",
		});

		expect(actual).toEqual({
			descriptor: "my-app",
			load: expect.any(Function),
			type: "template",
		});

		const loaded = await (actual as MigrationSource).load();
		expect(loaded).toBe(expected);
		expect(mockTryImportConfig).not.toHaveBeenCalled();
	});
});
