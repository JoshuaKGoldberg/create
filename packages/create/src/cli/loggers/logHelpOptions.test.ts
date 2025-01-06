import { describe, expect, test, vi } from "vitest";

import { logHelpOptions } from "./logHelpOptions.js";

const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	log: {
		get message() {
			return mockMessage;
		},
	},
}));

describe("logHelpOptions", () => {
	test("output without examples or text", () => {
		logHelpOptions("category", [
			{
				flag: "--abc",
				type: "number",
			},
			{
				flag: "--def",
				type: "string",
			},
		]);

		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "category options:

			  ----abc (number): 
			  ----def (string): ",
			  ],
			]
		`);
	});

	test("output witho examples and text", () => {
		logHelpOptions("category", [
			{
				examples: ["a", "b"],
				flag: "--abc",
				type: "number",
			},
			{
				examples: ["c", "d"],
				flag: "--def",
				type: "string",
			},
		]);

		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "category options:

			  ----abc (number): 
			      npx create a
			      npx create b

			  ----def (string): 
			      npx create c
			      npx create d
			",
			  ],
			]
		`);
	});
});
