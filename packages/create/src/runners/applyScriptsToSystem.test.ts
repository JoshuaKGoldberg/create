import { describe, expect, it, test, vi } from "vitest";

import { applyScriptsToSystem } from "./applyScriptsToSystem.js";

describe("applyCommandsToSystem", () => {
	it("runs phase commands in different phases in order of phase", async () => {
		const scripts = [
			{ commands: ["c", "d"], phase: 1 },
			{ commands: ["a", "b"], phase: 0 },
		];
		const runner = vi.fn();

		await applyScriptsToSystem(scripts, runner);

		expect(runner.mock.calls).toEqual([["a"], ["b"], ["c"], ["d"]]);
	});

	it("runs phase commands in the same phase in series", async () => {
		const scripts = [
			{ commands: ["a", "b"], phase: 0 },
			{ commands: ["c", "d"], phase: 0 },
		];
		const runner = vi.fn();

		await applyScriptsToSystem(scripts, runner);

		expect(runner.mock.calls).toEqual([["a"], ["c"], ["b"], ["d"]]);
	});

	test("mixed phase commands", async () => {
		const scripts = [
			{ commands: ["a", "b"], phase: 2 },
			{ commands: ["c", "d", "e"], phase: 1 },
			{ commands: ["f", "g"], phase: 1 },
			{ commands: ["h"], phase: 0 },
		];
		const runner = vi.fn();

		await applyScriptsToSystem(scripts, runner);

		expect(runner.mock.calls).toEqual([
			["h"],
			["c"],
			["f"],
			["d"],
			["g"],
			["e"],
			["a"],
			["b"],
		]);
	});
});
