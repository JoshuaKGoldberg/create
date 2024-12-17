import { describe, expect, test } from "vitest";

import { CreatedFiles } from "../types/creations.js";
import { mergeFileCreations } from "./mergeFileCreations.js";

describe("mergeFileCreations", () => {
	test.each([
		[{}, {}, {}],
		[{ a: false }, { a: undefined }, {}],
		[{ a: "" }, { a: "" }, { a: "" }],
		[{ a: "" }, { b: "" }, { a: "", b: "" }],
		[{ a: "1" }, { a: "2" }, "Conflicting created files at path: 'a'."],
		[{ a: "1" }, { a: ["2"] }, "Conflicting created files at path: 'a'."],
		[{ a: ["1"] }, { a: "2" }, "Conflicting created files at path: 'a'."],
		[{ a: ["1"] }, { a: ["2"] }, "Conflicting created files at path: 'a'."],
		[{ a: {} }, { a: {} }, { a: {} }],
		[{ a: {} }, { a: { b: "" } }, { a: { b: "" } }],
		[{ a: { b: "" } }, { a: {} }, { a: { b: "" } }],
		[{ a: { b: "" } }, { a: { b: "" } }, { a: { b: "" } }],
		[
			{ a: "" },
			{ a: {} },
			"Conflicting created directory and file at path: 'a'.",
		],
		[
			{ a: {} },
			{ a: "" },
			"Conflicting created directory and file at path: 'a'.",
		],
	] satisfies [CreatedFiles, CreatedFiles, CreatedFiles | string][])(
		"%j with %j",
		(first: CreatedFiles, second: CreatedFiles, expected?: object | string) => {
			if (typeof expected === "string") {
				expect(() => mergeFileCreations(first, second)).toThrow(expected);
			} else {
				expect(mergeFileCreations(first, second)).toEqual(expected);
			}
		},
	);
});
