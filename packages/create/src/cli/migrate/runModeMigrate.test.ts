import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { CLIStatus } from "../status.js";
import { runModeMigrate } from "./runModeMigrate.js";

const mockIsCancel = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
	log: {
		message: vi.fn(),
	},
	spinner: vi.fn(),
}));

const mockRunPreset = vi.fn();

vi.mock("../../runners/runPreset.js", () => ({
	get runPreset() {
		return mockRunPreset;
	},
}));

vi.mock("../../system/createSystemContextWithAuth.js", () => ({
	createSystemContextWithAuth: vi.fn().mockResolvedValue({}),
}));

vi.mock("../display/createClackDisplay.js", () => ({
	createClackDisplay: () => ({
		spinner: {
			start: vi.fn(),
			stop: vi.fn(),
		},
	}),
}));

const mockLoadMigrationPreset = vi.fn();

vi.mock("./loadMigrationPreset.js", () => ({
	get loadMigrationPreset() {
		return mockLoadMigrationPreset;
	},
}));

describe("runModeMigrate", () => {
	it("returns the error when loadMigrationPreset resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockLoadMigrationPreset.mockResolvedValueOnce(error);

		const actual = await runModeMigrate({
			args: [],
			configFile: undefined,
		});

		expect(actual).toEqual({
			outro: error.message,
			status: CLIStatus.Error,
		});
	});

	it("returns a cancellation status when loadMigrationPreset resolves with an error", async () => {
		mockLoadMigrationPreset.mockResolvedValueOnce({});
		mockIsCancel.mockReturnValueOnce(true);

		const actual = await runModeMigrate({
			args: [],
			configFile: undefined,
		});

		expect(actual).toEqual({
			status: CLIStatus.Cancelled,
		});
	});

	it("returns a CLI success when importing and running the preset succeeds", async () => {
		const base = createBase({
			options: {},
		});
		const preset = base.createPreset({
			about: { name: "Test" },
			blocks: [],
		});
		mockLoadMigrationPreset.mockResolvedValueOnce({ preset });
		mockIsCancel.mockReturnValueOnce(false);

		const actual = await runModeMigrate({
			args: [],
			configFile: "create.config.js",
		});

		expect(mockRunPreset).toHaveBeenCalledWith(preset, expect.any(Object));
		expect(actual).toEqual({
			outro: `You might want to commit any changes.`,
			status: CLIStatus.Success,
		});
	});
});
