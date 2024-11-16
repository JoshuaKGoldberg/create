import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createBase } from "./createBase.js";

const stubContext = {
	fetcher: vi.fn(),
	fs: {
		readFile: vi.fn(),
		writeFile: vi.fn(),
	},
	runner: vi.fn(),
	take: vi.fn(),
};

describe("createBase", () => {
	describe("createBlock", () => {
		describe("args", () => {
			it("allows passing no args when all are optional", () => {
				const base = createBase({
					options: {
						value: z.string(),
					},
				});

				const block = base.createBlock({
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
				const base = createBase({
					options: {
						value: z.string(),
					},
				});

				const block = base.createBlock({
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
				const base = createBase({
					options: {
						value: z.string(),
					},
				});

				const block = base.createBlock({
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
