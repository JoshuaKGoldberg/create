import { beforeEach, describe, expect, test, vi } from "vitest";

import { logOutro } from "./logOutro.js";

const mockOutro = vi.fn();
const mockLog = vi.fn();

vi.mock("@clack/prompts", () => ({
	get outro() {
		return mockOutro;
	},
}));

describe("logOutro", () => {
	beforeEach(() => {
		console.log = mockLog;
	});

	test("no suggestions", () => {
		logOutro("Bye!");

		expect(mockLog).not.toHaveBeenCalled();
		expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
	});

	test("empty suggestions", () => {
		logOutro("Bye!", []);

		expect(mockLog).not.toHaveBeenCalled();
		expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
	});

	test("suggestions", () => {
		logOutro("Bye!", ["a", "b", "c"]);

		expect(mockLog.mock.calls).toEqual([
			["Be sure to:"],
			[],
			["a"],
			["b"],
			["c"],
			[],
		]);
		expect(mockOutro.mock.calls).toEqual([["Bye!"]]);
	});
});
