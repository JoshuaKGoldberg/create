import { describe, expect, test, vi } from "vitest";

import { createPreset } from "../creators/createPreset";
import { runPreset } from "./runPreset";

const context = {
	fetcher: vi.fn(),
	fs: { readFile: vi.fn(), writeFile: vi.fn() },
	runner: vi.fn(),
	take: vi.fn(),
};

describe("runPreset", () => {
	test("files in one round", async () => {
		await runPreset(
			createPreset({
				documentation: {
					name: "Example",
				},
				options: {},
				produce: () => [
					{
						files: {
							"README.md": "# Hello, world!",
						},
					},
				],
			}),
			{},
			context,
		);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "README.md",
			    "# Hello, world!",
			  ],
			]
		`);
	});

	test("files with a second round", async () => {
		await runPreset(
			createPreset({
				documentation: {
					name: "Example",
				},
				options: {},
				produce: () => [
					{
						files: ({ metadata }) => {
							return {
								"README.md": `# Hello, world!

${Object.entries(metadata?.documentation ?? {})
	.map(([key, value]) => `## ${key}\n${value}`)
	.join("\n\n")}`,
							};
						},
						metadata: {
							documentation: {
								Build: "npm run build",
								Test: "npm run test",
							},
						},
					},
				],
			}),
			{},
			context,
		);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "README.md",
			    "# Hello, world!

			## Build
			npm run build

			## Test
			npm run test",
			  ],
			]
		`);
	});

	test("commands, files, packages, and scripts with a second round", async () => {
		await runPreset(
			createPreset({
				documentation: {
					name: "Example",
				},
				options: {},
				produce: () => [
					{
						commands: () => ["command a"],
						files: ({ metadata }) => {
							return {
								"README.md": `# Hello, world!

		${Object.entries(metadata?.documentation ?? {})
			.map(([key, value]) => `## ${key}\n${value}`)
			.join("\n\n")}`,
							};
						},
						metadata: {
							documentation: {
								Build: "npm run build",
								Test: "npm run test",
							},
						},
						packages: {
							dependencies: {
								"package-a": "^1.2.3",
							},
						},
						scripts: {
							build: "tsc",
							test: "vitest",
						},
					},
				],
			}),
			{},
			context,
		);

		expect(context.fs.writeFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "README.md",
			    "# Hello, world!

					## Build
			npm run build

			## Test
			npm run test",
			  ],
			  [
			    "package.json",
			    "{
			  "scripts": {
			    "build": "tsc",
			    "test": "vitest"
			  }
			}",
			  ],
			]
		`);
		expect(context.runner.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "command a",
			  ],
			  [
			    "pnpm add package-a@^1.2.3",
			  ],
			]
		`);
	});
});
