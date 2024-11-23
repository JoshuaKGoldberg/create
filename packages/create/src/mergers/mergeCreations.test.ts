import { describe, expect, it } from "vitest";

import { Creation } from "../types/creations.js";
import { mergeCreations } from "./mergeCreations.js";

const stubCreation = {
	addons: [],
	commands: [],
	files: {},
} satisfies Creation<unknown>;

describe("mergeCreations", () => {
	it("returns a merged creation when given two overlapping ones", () => {
		const actual = mergeCreations(
			{
				...stubCreation,
				commands: ["run a", "run b"],
				files: {
					"README.md": "Hello, world!",
					src: {
						"index.ts": "",
					},
				},
			},
			{
				commands: ["run c", "run d"],
				files: {
					src: {
						"second.ts": "// ...",
					},
				},
			},
		);

		expect(actual).toMatchInlineSnapshot(`
			{
			  "addons": [],
			  "commands": [
			    "run a",
			    "run b",
			    "run c",
			    "run d",
			  ],
			  "files": {
			    "README.md": "Hello, world!",
			    "src": {
			      "index.ts": "",
			      "second.ts": "// ...",
			    },
			  },
			}
		`);
	});

	it("reports a detailed files complaint when files conflict", () => {
		expect(() =>
			mergeCreations(
				{
					...stubCreation,
					files: {
						src: {
							"index.ts": "a",
						},
					},
				},
				{
					...stubCreation,
					files: {
						src: {
							"index.ts": "b",
						},
					},
				},
			),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Duplicate created file: 'src > index.ts'.]`,
		);
	});
});
