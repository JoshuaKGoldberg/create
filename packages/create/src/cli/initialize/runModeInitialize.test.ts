import { describe, expect, it, vi } from "vitest";

import { CLIStatus } from "../status.js";
import { runModeInitialize } from "./runModeInitialize.js";

const mockTryImportTemplate = vi.fn();

vi.mock("../importers/tryImportTemplate.js", () => ({
	get tryImportTemplate() {
		return mockTryImportTemplate;
	},
}));

describe("runModeInitialize", () => {
	it("returns a CLI error when no positional from can be found", async () => {
		const actual = await runModeInitialize({ args: [] });

		expect(actual).toEqual({
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		});

		expect(mockTryImportTemplate).not.toHaveBeenCalled();
	});

	it("returns a CLI error when importing the template fails", async () => {
		const message = "Oh no!";

		mockTryImportTemplate.mockResolvedValueOnce(new Error(message));

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({
			outro: message,
			status: CLIStatus.Error,
		});
	});
});
