import { describe, expect, test } from "vitest";

import { CreatedFileEntry } from "../types/creations.js";
import { mergeFileEntries } from "./mergeFileEntries.js";

const path = ["test", "path"];

describe("mergeFileEntries", () => {
	test.each([
		["", "", ""],
		["", false, ""],
		["", undefined, ""],
		[false, "", ""],
		[false, false, undefined],
		[false, undefined, undefined],
		[undefined, "", ""],
		[undefined, false, undefined],
		[undefined, undefined, undefined],
		["a", "a", "a"],
		["a", ["a"], "a"],
		["a", ["a", {}], "a"],
		[["a"], "a", "a"],
		[["a"], ["a"], "a"],
		[["a"], ["a"], "a"],
		[["a", {}], "a", "a"],
		[["a", {}], ["a", {}], "a"],
		[["a", {}], ["a", {}], "a"],
		[
			["a", { mode: "446" }],
			["a", { mode: "446" }],
			["a", { mode: "446" }],
		],
		[
			["a", { mode: "446" }],
			["a", { mode: "557" }],
			new Error(`Conflicting created file modes at path: 'test/path'.`),
		],
		["a", "b", new Error("Conflicting created files at path: 'test/path'.")],
		[
			["a"],
			["b"],
			new Error("Conflicting created files at path: 'test/path'."),
		],
	] satisfies [
		CreatedFileEntry | undefined,
		CreatedFileEntry | undefined,
		CreatedFileEntry | Error | undefined,
	][])("%j with %j", (first, second, expected) => {
		if (expected instanceof Error) {
			expect(() => mergeFileEntries(first, second, path)).toThrow(expected);
		} else {
			expect(mergeFileEntries(first, second, path)).toEqual(expected);
		}
	});
});
