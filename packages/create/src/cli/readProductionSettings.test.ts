import { describe, expect, it, vi } from "vitest";

import { readProductionSettings } from "./readProductionSettings.js";

const mockFindConfigFile = vi.fn();

vi.mock("./findConfigFile.js", () => ({
	get findConfigFile() {
		return mockFindConfigFile;
	},
}));

describe("readProductionSettings", () => {
	it("reads from directory '.' when a directory not provided", async () => {
		mockFindConfigFile.mockResolvedValueOnce(undefined);

		await readProductionSettings();

		expect(mockFindConfigFile).toHaveBeenCalledWith(".");
	});

	it("reads from the directory when provided", async () => {
		const directory = "./other";
		mockFindConfigFile.mockResolvedValueOnce(undefined);

		await readProductionSettings({ directory });

		expect(mockFindConfigFile).toHaveBeenCalledWith(directory);
	});

	it("returns the config file and mode: migrate when a config file is found without a mode", async () => {
		const configFile = "create.config.ts";
		mockFindConfigFile.mockResolvedValueOnce(configFile);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ configFile, mode: "migrate" });
		expect(mockFindConfigFile).toHaveBeenCalledWith(".");
	});

	it("returns an error when a config file is found in mode initialize", async () => {
		const configFile = "create.config.ts";
		mockFindConfigFile.mockResolvedValueOnce(configFile);

		const actual = await readProductionSettings({ mode: "initialize" });

		expect(actual).toEqual(
			new Error(
				`Cannot run in --mode initialize in a directory that already has a ${configFile}.`,
			),
		);
	});

	it("returns mode initialize when no config file is found without a mode", async () => {
		mockFindConfigFile.mockResolvedValueOnce(undefined);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ mode: "initialize" });
	});

	it("returns mode migrate when no config file is found in mode migrate", async () => {
		mockFindConfigFile.mockResolvedValueOnce(undefined);

		const actual = await readProductionSettings({ mode: "migrate" });

		expect(actual).toEqual({ mode: "migrate" });
	});
});
