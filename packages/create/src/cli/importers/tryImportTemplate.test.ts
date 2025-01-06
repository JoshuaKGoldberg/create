import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { tryImportTemplate } from "./tryImportTemplate.js";

const mockSpinner = {
	start: vi.fn(),
	stop: vi.fn(),
};

vi.mock("@clack/prompts", () => ({
	spinner: () => mockSpinner,
}));

const mockTryImportWithPredicate = vi.fn();

vi.mock("../tryImportWithPredicate.js", () => ({
	get tryImportWithPredicate() {
		return mockTryImportWithPredicate;
	},
}));

describe("tryImportTemplate", () => {
	it("returns the error when tryImportWithPredicate resolves with an error", async () => {
		const error = new Error("Oh no!");

		mockTryImportWithPredicate.mockResolvedValueOnce(error);

		const actual = await tryImportTemplate("create-my-app");

		expect(actual).toEqual(error);
		expect(mockSpinner.start.mock.calls).toEqual([
			[`Loading ${chalk.blue("create-my-app")}`],
		]);
		expect(mockSpinner.stop.mock.calls).toEqual([
			[
				`Could not load ${chalk.blue("create-my-app")}: ${chalk.red(error.message)}`,
				1,
			],
		]);
	});

	it("returns the template when tryImportWithPredicate resolves with a preset", async () => {
		const template = { isTemplate: true };

		mockTryImportWithPredicate.mockResolvedValueOnce(template);

		const actual = await tryImportTemplate("create-my-app");

		expect(actual).toEqual(template);
		expect(mockSpinner.start.mock.calls).toEqual([
			[`Loading ${chalk.blue("create-my-app")}`],
		]);
		expect(mockSpinner.stop.mock.calls).toEqual([
			[`Loaded ${chalk.blue("create-my-app")}`],
		]);
	});
});
