import { describe, expect, test } from "vitest";

import { findPositionalFrom } from "./findPositionalFrom.js";

describe("findPositionalFrom", () => {
	test.each([
		[["my-app"], "create-my-app"],
		[["create-my-app"], "create-my-app"],
		[["/bin/node", "create"], undefined],
		[["/bin/node", "create", "create-my-app"], "create-my-app"],
		[["/bin/node", "create", "my-app"], "create-my-app"],
		[["/bin/node", "create", "/create-my-app"], "/create-my-app"],
		[["/bin/node", "create", "/my-app"], "/my-app"],
		[["/bin/node", "create", "./create-my-app"], "./create-my-app"],
		[["/bin/node", "create", "./my-app"], "./my-app"],
		// npx create /repos/create-my-app
		[["/repos/create-my-app"], "/repos/create-my-app"],
		// npx create /repos/create-my-app --preset common
		[["/repos/create-my-app", "--preset", "common"], "/repos/create-my-app"],
	])("%j", (input, expected) => {
		expect(findPositionalFrom(input)).toBe(expected);
	});
});
