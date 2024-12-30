import { describe, expect, it, vi } from "vitest";

import { CLIStatus } from "../status.js";
import { runModeInitialize } from "./runModeInitialize.js";

const mockIsCancel = vi.fn();

vi.mock("@clack/prompts", () => ({
	get isCancel() {
		return mockIsCancel;
	},
}));

const mockTryImportTemplatePreset = vi.fn();

vi.mock("../importers/tryImportTemplatePreset.js", () => ({
	get tryImportTemplatePreset() {
		return mockTryImportTemplatePreset;
	},
}));

describe("runModeInitialize", () => {
	it("returns a CLI error when no positional from can be found", async () => {
		const actual = await runModeInitialize({ args: [] });

		expect(actual).toEqual({
			outro: "Please specify a package to create from.",
			status: CLIStatus.Error,
		});

		expect(mockTryImportTemplatePreset).not.toHaveBeenCalled();
	});

	it("returns the error when importing tryImportTemplatePreset resolves with an error", async () => {
		const message = "Oh no!";

		mockTryImportTemplatePreset.mockResolvedValueOnce(new Error(message));

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({
			outro: message,
			status: CLIStatus.Error,
		});
	});

	it("returns the cancellation when tryImportTemplatePreset is cancelled", async () => {
		const cancellation = Symbol.for("cancel");
		mockTryImportTemplatePreset.mockResolvedValueOnce(cancellation);
		mockIsCancel.mockReturnValueOnce(true);

		const actual = await runModeInitialize({
			args: ["node", "create", "my-app"],
		});

		expect(actual).toEqual({ status: CLIStatus.Cancelled });
	});
});
