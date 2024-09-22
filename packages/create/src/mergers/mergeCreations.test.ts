import { describe, expect, it } from "vitest";

import { Creation, MetadataFileType } from "../types/creations.js";
import { mergeCreations } from "./mergeCreations.js";

const stubCreation = {
	commands: [],
	documentation: {},
	editor: {},
	files: {},
	jobs: [],
	metadata: [],
	package: {},
} satisfies Creation;

describe("mergeCreations", () => {
	it("returns a merged creation when given two non-intersecting ones", () => {
		const actual = mergeCreations(
			{
				...stubCreation,
				files: {
					"README.md": "Hello, world!",
				},
			},
			{
				...stubCreation,
				documentation: {
					build: "npm run build",
				},
			},
		);

		expect(actual).toMatchInlineSnapshot(`
			{
			  "commands": [],
			  "documentation": {
			    "build": "npm run build",
			  },
			  "editor": {
			    "debuggers": [],
			    "settings": {},
			    "tasks": [],
			  },
			  "files": {
			    "README.md": "Hello, world!",
			  },
			  "jobs": [],
			  "metadata": [],
			  "package": {},
			}
		`);
	});

	it("returns a merged creation when given two overlapping ones", () => {
		const actual = mergeCreations(
			{
				...stubCreation,
				commands: ["run a", "run b"],
				documentation: {
					build: "npm run build",
				},
				files: {
					"README.md": "Hello, world!",
					src: {
						"index.ts": "",
					},
				},
				metadata: [{ glob: "src/**/*.ts", type: MetadataFileType.Source }],
				package: {
					dependencies: {
						example: "^1.2.3",
					},
					scripts: {
						build: "tsc",
					},
				},
			},
			{
				commands: ["run c", "run d"],
				documentation: {
					test: "npm run test",
				},
				files: {
					src: {
						"second.ts": "// ...",
					},
				},
				metadata: [{ glob: "src/**/*.test.ts", type: MetadataFileType.Test }],
				package: {
					dependencies: {
						example: "^1.2.4",
					},
					scripts: {
						build: "tsc",
						test: "vitest",
					},
				},
			},
		);

		expect(actual).toMatchInlineSnapshot(`
			{
			  "commands": [
			    "run a",
			    "run b",
			    "run c",
			    "run d",
			  ],
			  "documentation": {
			    "build": "npm run build",
			    "test": "npm run test",
			  },
			  "editor": {},
			  "files": {
			    "README.md": "Hello, world!",
			    "src": {
			      "index.ts": "",
			      "second.ts": "// ...",
			    },
			  },
			  "jobs": [],
			  "metadata": [
			    {
			      "glob": "src/**/*.ts",
			      "type": 6,
			    },
			    {
			      "glob": "src/**/*.test.ts",
			      "type": 7,
			    },
			  ],
			  "package": {
			    "dependencies": {
			      "example": "^1.2.3 || ^1.2.4",
			    },
			    "scripts": {},
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

	it("reports a detailed package complaint when package conflicts", () => {
		expect(() =>
			mergeCreations(
				{
					...stubCreation,
					package: {
						dependencies: {
							example: "1.2.3",
						},
					},
				},
				{
					package: {
						dependencies: {
							example: "2.3.4",
						},
					},
				},
			),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Conflicting dependencies entries for example: 1.2.3 vs. 2.3.4.]`,
		);
	});
});
