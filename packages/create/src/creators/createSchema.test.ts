import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Creation } from "../types/creations.js";
import { createSchema } from "./createSchema.js";

const stubContext = {
	created: {} as Creation<never, { value: string }>,
	fetcher: vi.fn(),
	fs: {
		readFile: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
	take: vi.fn(),
};

describe("createSchema", () => {
	describe("createBlock", () => {
		describe("args", () => {
			it("allows passing no args when all are optional", () => {
				const schema = createSchema({
					options: {
						value: z.string(),
					},
				});

				const block = schema.createBlock({
					about: { name: "Example" },
					args: {
						unnecessary: z.string().optional(),
					},
					produce({ options }) {
						return {
							files: {
								"README.md": options.value,
							},
						};
					},
				});

				const output = block().produce({
					...stubContext,
					options: {
						value: "Hello, world!",
					},
				});

				expect(output).toMatchInlineSnapshot(`
				{
				  "files": {
				    "README.md": "Hello, world!",
				  },
				}
			`);
			});

			it("creates a block with a single arg", () => {
				const schema = createSchema({
					options: {
						value: z.string(),
					},
				});

				const block = schema.createBlock({
					about: { name: "Example" },
					args: {
						fileName: z.string(),
					},
					produce({ args, options }) {
						return {
							files: {
								[args.fileName]: options.value,
							},
						};
					},
				});

				const output = block({
					fileName: "README.md",
				}).produce({
					...stubContext,
					options: {
						value: "Hello, world!",
					},
				});

				expect(output).toMatchInlineSnapshot(`
				{
				  "files": {
				    "README.md": "Hello, world!",
				  },
				}
			`);
			});

			it("creates a block with multiple merged args", () => {
				const schema = createSchema({
					options: {
						value: z.string(),
					},
				});

				const block = schema.createBlock({
					about: { name: "Example" },
					args: {
						fileName: z.string(),
						license: z.string(),
					},
					produce({ args, options }) {
						return {
							files: {
								[args.fileName]: options.value,
								"LICENSE.md": args.license,
							},
						};
					},
				});

				const output = block({
					fileName: "README.md",
					license: "MIT",
				}).produce({
					...stubContext,
					options: {
						value: "Hello, world!",
					},
				});

				expect(output).toMatchInlineSnapshot(`
				{
				  "files": {
				    "LICENSE.md": "MIT",
				    "README.md": "Hello, world!",
				  },
				}
			`);
			});
		});
	});
});
