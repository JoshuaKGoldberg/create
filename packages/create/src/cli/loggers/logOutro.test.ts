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

		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Enjoy! 💝",
			  ],
			  [],
			]
		`);
		expect(mockOutro.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Bye!",
			  ],
			]
		`);
	});

	test("empty suggestions", () => {
		logOutro("Bye!", []);

		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Enjoy! 💝",
			  ],
			  [],
			]
		`);
		expect(mockOutro.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Bye!",
			  ],
			]
		`);
	});

	test("suggestions", () => {
		logOutro("Bye!", ["a", "b", "c"]);

		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Be sure to:",
			  ],
			  [],
			  [
			    "a",
			  ],
			  [
			    "b",
			  ],
			  [
			    "c",
			  ],
			  [],
			  [
			    "Enjoy! 💝",
			  ],
			  [],
			]
		`);
		expect(mockOutro.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Bye!",
			  ],
			]
		`);
	});
});
