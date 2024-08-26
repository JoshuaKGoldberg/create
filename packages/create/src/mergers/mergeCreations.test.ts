import { describe, expect, it } from "vitest";

import { FileType } from "../metadata";
import { Creation } from "../shared";
import { mergeCreations } from "./mergeCreations";

describe("mergeCreations", () => {
	it("returns the creation when given one", () => {
		const creation: Creation = {
			files: {},
		};

		const actual = mergeCreations([creation]);

		expect(actual).toBe(creation);
	});

	it("returns a merged creation when given two non-intersecting ones", () => {
		const actual = mergeCreations([
			{
				files: {
					"README.md": "Hello, world!",
				},
			},
			{
				metadata: {
					documentation: {
						build: "npm run build",
					},
				},
			},
		]);

		expect(actual).toEqual({
			files: {
				"README.md": "Hello, world!",
			},
			metadata: {
				documentation: {
					build: "npm run build",
				},
			},
		});
	});

	it("returns a merged creation when given two overlapping ones", () => {
		const actual = mergeCreations([
			{
				commands: ["run a", "run b"],
				files: {
					"README.md": "Hello, world!",
					src: {
						"index.ts": "",
					},
				},
				metadata: {
					documentation: {
						build: "npm run build",
					},
					files: [{ glob: "src/**/*.ts", type: FileType.Source }],
				},
				packages: {
					dependencies: {
						example: "^1.2.3",
					},
				},
				scripts: {
					build: "tsc",
				},
			},
			{
				commands: ["run c", "run d"],
				files: {
					src: {
						"second.ts": "// ...",
					},
				},
				metadata: {
					documentation: {
						test: "npm run test",
					},
					files: [{ glob: "src/**/*.test.ts", type: FileType.Test }],
				},
				packages: {
					dependencies: {
						example: "^1.2.4",
					},
				},
				scripts: {
					build: "tsc",
					test: "vitest",
				},
			},
		]);

		expect(actual).toEqual({
			commands: ["run a", "run b", "run c", "run d"],
			files: {
				"README.md": "Hello, world!",
				src: {
					"index.ts": "",
					"second.ts": "// ...",
				},
			},
			metadata: {
				documentation: {
					build: "npm run build",
					test: "npm run test",
				},
				files: [
					{ glob: "src/**/*.ts", type: FileType.Source },
					{ glob: "src/**/*.test.ts", type: FileType.Test },
				],
			},
			packages: {
				dependencies: {
					example: "^1.2.3 || ^1.2.4",
				},
			},
			scripts: {
				build: "tsc",
				test: "vitest",
			},
		});
	});

	it("reports a detailed files complaint when files conflict", () => {
		expect(() =>
			mergeCreations([
				{
					files: {
						src: {
							"index.ts": "a",
						},
					},
				},
				{
					files: {
						src: {
							"index.ts": "b",
						},
					},
				},
			]),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Duplicate created file: 'src > index.ts'.]`,
		);
	});

	it("reports a detailed packages complaint when packages conflict", () => {
		expect(() =>
			mergeCreations([
				{
					packages: {
						dependencies: {
							example: "1.2.3",
						},
					},
				},
				{
					packages: {
						dependencies: {
							example: "2.3.4",
						},
					},
				},
			]),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Conflicting dependencies entries for example: 1.2.3 vs. 2.3.4.]`,
		);
	});

	it("reports a detailed scripts complaint when scripts conflict", () => {
		expect(() =>
			mergeCreations([
				{
					scripts: {
						build: "builder a",
					},
				},
				{
					scripts: {
						build: "builder b",
					},
				},
			]),
		).toThrowErrorMatchingInlineSnapshot(
			`[Error: Conflicting script for "build": "builder a" vs. "builder b"]`,
		);
	});
});
