import { describe, expect, test } from "vitest";

import { CreatedFiles } from "../types/creations.js";
import { mergeFileCreations } from "./mergeFileCreations.js";

const path = ["test"];

describe("mergeFileCreations", () => {
	test.each([
		[undefined, undefined, undefined],
		[{}, undefined, {}],
		[undefined, {}, {}],
		[{}, {}, {}],
		[{ a: "" }, { a: "" }, { a: "" }],
		[{ a: "" }, { b: "" }, { a: "", b: "" }],
		[{ a: "1" }, { a: "2" }, "Conflicting created files at path: 'test/a'."],
		[{ a: "1" }, { a: ["2"] }, "Conflicting created files at path: 'test/a'."],
		[{ a: ["1"] }, { a: "2" }, "Conflicting created files at path: 'test/a'."],
		[
			{ a: ["1"] },
			{ a: ["2"] },
			"Conflicting created files at path: 'test/a'.",
		],
		[{ a: {} }, { a: {} }, { a: {} }],
		[{ a: {} }, { a: { b: "" } }, { a: { b: "" } }],
		[{ a: { b: "" } }, { a: {} }, { a: { b: "" } }],
		[{ a: { b: "" } }, { a: { b: "" } }, { a: { b: "" } }],
		[
			{ a: "" },
			{ a: {} },
			"Conflicting created directory and file at path: 'test/a'.",
		],
		[
			{ a: {} },
			{ a: "" },
			"Conflicting created directory and file at path: 'test/a'.",
		],
	] satisfies [
		CreatedFiles | undefined,
		CreatedFiles | undefined,
		CreatedFiles | string | undefined,
	][])(
		"%j with %j",
		(
			first: CreatedFiles | undefined,
			second: CreatedFiles | undefined,
			expected?: object | string,
		) => {
			if (typeof expected === "string") {
				expect(() => mergeFileCreations(first, second, path)).toThrow(expected);
			} else {
				expect(mergeFileCreations(first, second, path)).toEqual(expected);
			}
		},
	);
});
