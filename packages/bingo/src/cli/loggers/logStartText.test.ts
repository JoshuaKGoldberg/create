import { describe, expect, it, vi } from "vitest";

import { logStartText } from "./logStartText.js";

const mockError = vi.fn();
const mockInfo = vi.fn();
const mockMessage = vi.fn();

vi.mock("@clack/prompts", () => ({
	get log() {
		return {
			error: mockError,
			info: mockInfo,
			message: mockMessage,
		};
	},
}));

describe("logStartText", () => {
	it("only logs an initial message when offline is falsy", () => {
		logStartText("transition", "from", "type", false);

		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Running with mode --transition using the type:
			  from",
			  ],
			]
		`);
	});

	it("additionally logs an offline when offline is true", () => {
		logStartText("transition", "from", "type", true);

		expect(mockMessage.mock.calls).toMatchInlineSnapshot(`
		[
		  [
		    "Running with mode --transition using the type:
		  from",
		  ],
		  [
		    "--offline enabled. You'll need to git push any changes manually.",
		  ],
		]
	`);
	});
});
