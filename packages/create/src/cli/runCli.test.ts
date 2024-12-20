import { describe, expect, it, vi } from "vitest";

import { runCli } from "./runCli.js";
import { CLIStatus } from "./status.js";

const mockPackageData = { version: "1.2.3-test" };

vi.mock("../packageData.js", () => ({
	get packageData() {
		return mockPackageData;
	},
}));

const mockLogHelpText = vi.fn().mockReturnValue("(help text)");

vi.mock("./loggers/logHelpText.js", () => ({
	get logHelpText() {
		return mockLogHelpText;
	},
}));

const logger = {
	log: vi.fn(),
};

describe("readProductionSettings", () => {
	it("logs help text when --help is provided", async () => {
		const actual = await runCli(["--help"], logger);

		expect(actual).toBe(CLIStatus.Success);
		expect(mockLogHelpText).toHaveBeenCalled();
		expect(logger.log).not.toHaveBeenCalled();
	});

	it("logs version when --version is provided", async () => {
		const actual = await runCli(["--version"], logger);

		expect(actual).toBe(CLIStatus.Success);
		expect(mockLogHelpText).not.toHaveBeenCalled();
		expect(logger.log).toHaveBeenCalledWith(mockPackageData.version);
	});
});
