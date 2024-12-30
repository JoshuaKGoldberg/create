import { describe, expect, it, vi } from "vitest";

import { findConfigFile } from "./findConfigFile.js";

const mockReaddir = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readdir() {
		return mockReaddir;
	},
}));

describe("findConfigFile", () => {
	it("returns false when readdir rejects", async () => {
		mockReaddir.mockRejectedValueOnce(new Error("Oh no!"));

		const actual = await findConfigFile(".");

		expect(actual).toBe(undefined);
	});

	it("returns a create.config.js when it exists", async () => {
		mockReaddir.mockResolvedValueOnce(["a", "create.config.js", "b"]);

		const actual = await findConfigFile(".");

		expect(actual).toBe("create.config.js");
	});

	it("returns a create.config.mjs when it exists", async () => {
		mockReaddir.mockResolvedValueOnce(["a", "create.config.mjs", "b"]);

		const actual = await findConfigFile(".");

		expect(actual).toBe("create.config.mjs");
	});

	it("returns undefined when no create.config.* exists", async () => {
		mockReaddir.mockResolvedValueOnce(["a", "b"]);

		const actual = await findConfigFile(".");

		expect(actual).toBe(undefined);
	});
});
