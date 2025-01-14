import { describe, expect, it, vi } from "vitest";

import { intakeFromDirectory } from "./intakeFromDirectory.js";

const mockReaddir = vi.fn();
const mockReadFile = vi.fn();
const mockStat = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readdir() {
		return mockReaddir;
	},
	get readFile() {
		return mockReadFile;
	},
	get stat() {
		return mockStat;
	},
}));

describe("intakeFromDirectory", () => {
	it("returns an empty object when the directory has no files", async () => {
		mockReaddir.mockResolvedValueOnce([]);

		const directory = await intakeFromDirectory("from", {
			exclude: /excluded/,
		});

		expect(directory).toEqual({});
		expect(mockReaddir.mock.calls).toEqual([["from"]]);
		expect(mockStat).not.toHaveBeenCalled();
	});

	it("returns non-excluded files when the directory contains files", async () => {
		mockReaddir.mockResolvedValueOnce(["excluded", "included-a", "included-b"]);
		mockReadFile
			.mockResolvedValueOnce("contents-a")
			.mockResolvedValueOnce("contents-b");
		mockStat
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 123,
			})
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 456,
			});

		const directory = await intakeFromDirectory("from", {
			exclude: /excluded/,
		});

		expect(directory).toEqual({
			"included-a": ["contents-a", { mode: 123 }],
			"included-b": ["contents-b", { mode: 456 }],
		});
		expect(mockReaddir.mock.calls).toEqual([["from"]]);
		expect(mockStat.mock.calls).toEqual([
			["from/included-a"],
			["from/included-b"],
		]);
	});

	it("returns a nested file when the directory contains a nested directory", async () => {
		mockReaddir
			.mockResolvedValueOnce(["middle"])
			.mockResolvedValueOnce(["excluded", "included"]);
		mockReadFile.mockResolvedValueOnce("contents");
		mockStat
			.mockResolvedValueOnce({
				isDirectory: () => true,
			})
			.mockResolvedValueOnce({
				isDirectory: () => false,
				mode: 123,
			});

		const directory = await intakeFromDirectory("from", {
			exclude: /excluded/,
		});

		expect(directory).toEqual({
			middle: {
				included: ["contents", { mode: 123 }],
			},
		});
		expect(mockReaddir.mock.calls).toEqual([["from"], ["from/middle"]]);
		expect(mockStat.mock.calls).toEqual([
			["from/middle"],
			["from/middle/included"],
		]);
	});
});
