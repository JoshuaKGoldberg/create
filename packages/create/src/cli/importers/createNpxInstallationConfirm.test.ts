import chalk from "chalk";
import { describe, expect, it, vi } from "vitest";

import { ClackSpinner } from "../display/createClackDisplay.js";
import { createNpxInstallationConfirm } from "./createNpxInstallationConfirm.js";

const createSpinner = () => ({
	message: vi.fn(),
	start: vi.fn(),
	stop: vi.fn(),
});

const mockConfirm = vi.fn();

vi.mock("@clack/prompts", () => ({
	confirm: () => mockConfirm,
}));

describe("createNpxInstallationConfirm", () => {
	it("resolves with undefined without confirming if yes is true", async () => {
		const spinner = createSpinner();

		const actual = await createNpxInstallationConfirm(
			"../create-my-app",
			spinner,
			true,
		)();

		expect(actual).toBe(undefined);
		expect(mockConfirm).not.toHaveBeenCalled();
		expect(spinner.start.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Loading ../create-my-app",
			  ],
			]
		`);
		expect(spinner.stop.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "../create-my-app not found locally and --yes specified. ../create-my-app will be fetched with npx. ",
			  ],
			]
		`);
	});

	it("resolves with an error if yes is false and the confirm prompt is not accepted", async () => {
		const spinner = createSpinner();
		mockConfirm.mockResolvedValueOnce(false);

		const actual = await createNpxInstallationConfirm(
			"../create-my-app",
			spinner,
			false,
		)();

		expect(actual).toEqual(new Error("Installation cancelled."));
		expect(spinner.start.mock.calls).toMatchInlineSnapshot(`[]`);
		expect(spinner.stop.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "../create-my-app not found locally and --yes not specified. ../create-my-app will need to be fetched with npx. ",
			  ],
			]
		`);
	});

	it("resolves with undefined if yes is false and the confirm prompt is accepted", async () => {
		const spinner = createSpinner();
		mockConfirm.mockResolvedValueOnce(false);

		const actual = await createNpxInstallationConfirm(
			"../create-my-app",
			spinner,
			true,
		)();

		expect(actual).toEqual(undefined);
		expect(spinner.start.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Loading ../create-my-app",
			  ],
			]
		`);
		expect(spinner.stop.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "../create-my-app not found locally and --yes specified. ../create-my-app will be fetched with npx. ",
			  ],
			]
		`);
	});
});
