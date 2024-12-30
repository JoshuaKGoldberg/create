import { describe, expect, it, vi } from "vitest";

import { createConfig } from "../../config/createConfig.js";
import { createBase } from "../../creators/createBase.js";
import { CLIStatus } from "../status.js";
import { runModeMigrate } from "./runModeMigrate.js";

vi.mock("@clack/prompts", () => ({
	log: {
		message: vi.fn(),
	},
	spinner: vi.fn(),
}));

const mockTryImportConfig = vi.fn();

vi.mock("../../config/tryImportConfig.js", () => ({
	get tryImportConfig() {
		return mockTryImportConfig;
	},
}));

const mockRunPreset = vi.fn();

vi.mock("../../runners/runPreset.js", () => ({
	get runPreset() {
		return mockRunPreset;
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

describe("runModeMigrate", () => {
	it("returns a CLI error when configFile is undefined", async () => {
		const actual = await runModeMigrate({ configFile: undefined });

		expect(actual).toEqual({
			outro:
				"--mode migrate without a configFile is not yet implemented. Check back later! ❤️‍🔥",
			status: CLIStatus.Error,
		});

		expect(mockTryImportConfig).not.toHaveBeenCalled();
	});

	it("returns a CLI error when importing the preset fails", async () => {
		const message = "Oh no!";

		mockTryImportConfig.mockResolvedValueOnce(new Error(message));

		const actual = await runModeMigrate({
			configFile: "create.config.js",
		});

		expect(actual).toEqual({
			outro: message,
			status: CLIStatus.Error,
		});
	});

	it.only("returns a CLI success when importing the preset succeeds", async () => {
		const base = createBase({
			options: {},
		});
		const preset = base.createPreset({
			about: { name: "Test" },
			blocks: [],
		});
		mockTryImportConfig.mockResolvedValueOnce(createConfig(preset));

		const actual = await runModeMigrate({
			configFile: "create.config.js",
		});

		expect(actual).toEqual({
			outro: `Applied the Test preset to files on disk. You might want to commit any changes.`,
			status: CLIStatus.Success,
		});
	});
});
