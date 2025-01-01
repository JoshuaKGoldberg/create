import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { readProductionSettings } from "./readProductionSettings.js";

const mockReaddir = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readdir() {
		return mockReaddir;
	},
}));

describe("readProductionSettings", () => {
	it("reads from directory '.' when a directory is not provided", async () => {
		mockReaddir.mockResolvedValueOnce([]);

		await readProductionSettings();

		expect(mockReaddir).toHaveBeenCalledWith(".");
	});

	it("reads from the directory when provided", async () => {
		const directory = "./other";
		mockReaddir.mockResolvedValueOnce([]);

		await readProductionSettings({ directory });

		expect(mockReaddir).toHaveBeenCalledWith(directory);
	});

	it("returns mode: initialize when the directory does not exist and mode is not provided", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await readProductionSettings({
			directory: "other",
		});

		expect(actual).toEqual({ mode: "initialize" });
	});

	it("returns mode: initialize when the directory does not exist and mode is initialize", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await readProductionSettings({
			directory: "other",
			mode: "initialize",
		});

		expect(actual).toEqual({ mode: "initialize" });
	});

	it("returns an error when the directory does not exist and mode is migrate", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await readProductionSettings({
			directory: "other",
			mode: "migrate",
		});

		expect(actual).toEqual(
			new Error(
				"Cannot run with --mode migrate on a directory that does not yet exist.",
			),
		);
	});

	it("returns the config file and mode: migrate when a config file is found without a mode", async () => {
		const configFile = "create.config.ts";
		mockReaddir.mockResolvedValueOnce([configFile]);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ configFile, mode: "migrate" });
	});

	it("returns the config file relative to the directory when a config file is found with a directory", async () => {
		const configFile = "create.config.ts";
		mockReaddir.mockResolvedValueOnce([configFile]);

		const actual = await readProductionSettings({ directory: "path/to" });

		expect(actual).toEqual({
			configFile: path.join("path/to", configFile),
			mode: "migrate",
		});
	});

	it("returns mode migrate when only a .git is is found with mode migrate", async () => {
		mockReaddir.mockResolvedValueOnce([".git"]);

		const actual = await readProductionSettings({ mode: "migrate" });

		expect(actual).toEqual({ mode: "migrate" });
	});

	it("returns mode initialize when only a .git is is found with mode initialize", async () => {
		mockReaddir.mockResolvedValueOnce([".git"]);

		const actual = await readProductionSettings({ mode: "initialize" });

		expect(actual).toEqual({ mode: "initialize" });
	});

	it("returns mode migrate when only a .git is is found without a mode", async () => {
		mockReaddir.mockResolvedValueOnce([".git"]);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ mode: "migrate" });
	});

	it("returns mode initialize when no config file or .git is found without a mode", async () => {
		mockReaddir.mockResolvedValueOnce([]);

		const actual = await readProductionSettings();

		expect(actual).toEqual({ mode: "initialize" });
	});
});
