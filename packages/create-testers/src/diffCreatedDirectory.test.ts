import { CreatedDirectory } from "create-fs";
import { describe, expect, test } from "vitest";

import {
	diffCreatedDirectory,
	DiffedCreatedDirectory,
} from "./diffCreatedDirectory.js";

describe("diffCreatedDirectory", () => {
	test.each([
		[{}, {}, undefined],
		[{}, { a: "" }, { a: "" }],
		[{}, { a: { b: "" } }, { a: { b: "" } }],
		[{ a: "" }, { a: "" }, undefined],
		[
			{ a: "" },
			{ a: "b\n" },
			{
				a: `@@ -0,0 +1,1 @@
+b
`,
			},
		],
		[{ a: "b\n" }, { a: "b\n" }, undefined],
		[
			{ a: "abc\n" },
			{ a: "bbc\n" },
			{
				a: `@@ -1,1 +1,1 @@
-abc
+bbc
`,
			},
		],
		[{ a: "b\n" }, {}, undefined],
		[{ a: "" }, { a: [""] }, undefined],
		[{ a: "" }, { a: ["", { mode: undefined }] }, undefined],
		[{ a: "" }, { a: ["", { mode: 123 }] }, undefined],
		[{ a: [""] }, { a: ["", { mode: 123 }] }, undefined],
		[
			{ a: ["", { mode: undefined }] },
			{ a: ["", { mode: undefined }] },
			undefined,
		],
		[{ a: ["", { mode: undefined }] }, { a: ["", { mode: 123 }] }, undefined],
		[{ a: ["", { mode: 123 }] }, { a: ["", { mode: 123 }] }, undefined],
		[{ a: ["", { mode: 123 }] }, { a: [""] }, undefined],
		[{ a: ["", { mode: 123 }] }, { a: ["", {}] }, undefined],
		[{ a: ["", { mode: 123 }] }, { a: ["", { mode: undefined }] }, undefined],
		[
			{ a: ["", { mode: 123 }] },
			{ a: ["", { mode: 456 }] },
			{
				a: [
					undefined,
					{
						mode: `@@ -1,1 +1,1 @@
-7b
\\ No newline at end of file
+1c8
\\ No newline at end of file
`,
					},
				],
			},
		],
		[
			{ a: "" },
			{ a: { b: {} } },
			{ a: "Mismatched a: actual is string; created is object." },
		],
		[
			{ a: [""] },
			{ a: { b: {} } },
			{ a: "Mismatched a: actual is created file; created is object." },
		],
		[{ a: [""] }, { a: "" }, undefined],
		[
			{ a: ["b\n"] },
			{ a: "" },
			{
				a: `@@ -1,1 +0,0 @@
-b
`,
			},
		],
		[
			{ a: { b: {} } },
			{ a: "" },
			{ a: "Mismatched a: actual is object; created is string." },
		],
		[
			{ a: { b: {} } },
			{ a: [""] },
			{ a: "Mismatched a: actual is object; created is created file." },
		],
		[{ a: "" }, { a: [""] }, undefined],
		[{ a: { b: "c\n" } }, {}, undefined],
		[{ a: { b: "c\n" } }, { b: {} }, undefined],
		[{ a: { b: "c\n" } }, { a: { b: "c\n" } }, undefined],
		[
			{ a: { b: "c\n" } },
			{ a: { b: "d\n" } },
			{
				a: {
					b: `@@ -1,1 +1,1 @@
-c
+d
`,
				},
			},
		],
		[{ a: { b: "c\n" } }, { a: { d: "e\n" } }, { a: { d: "e\n" } }],
		[
			{ a: { b: { c: undefined } } },
			{ a: { b: { c: { d: "e\n" } } } },
			{ a: { b: { c: { d: "e\n" } } } },
		],
		[
			{ a: { b: { c: { d: "e\n" } } } },
			{ a: { b: { c: undefined } } },
			undefined,
		],
		[{ a: { b: "c\n" } }, { a: { d: "e\n" } }, { a: { d: "e\n" } }],
		[
			{ a: { b: { c: { d: "e\n" } } } },
			{ a: { b: { f: "g\n" } } },
			{ a: { b: { f: "g\n" } } },
		],
	] satisfies [
		CreatedDirectory,
		CreatedDirectory,
		DiffedCreatedDirectory | undefined,
	][])("%j and %j", (actual, created, expected) => {
		expect(diffCreatedDirectory(actual, created, (text) => text)).toEqual(
			expected,
		);
	});
});
