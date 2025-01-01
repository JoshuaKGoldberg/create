import { describe, expect, it, vi } from "vitest";

import { createBase } from "../../creators/createBase.js";
import { applyArgsToSettings } from "./applyArgsToSettings.js";

const base = createBase({
	options: {},
});

const blockA = base.createBlock({
	about: { name: "A" },
	produce: vi.fn(),
});

const blockB = base.createBlock({
	about: { name: "B" },
	produce: vi.fn(),
});

const blockC = base.createBlock({
	about: { name: "C" },
	produce: vi.fn(),
});

const blockD = base.createBlock({
	about: { name: "D" },
	produce: vi.fn(),
});

const preset = base.createPreset({
	about: { name: "Preset " },
	blocks: [blockA, blockB, blockC],
});

describe("applyArgsToSettings", () => {
	it("returns blank settings when args don't exclude Blocks and settings is undefined", () => {
		const actual = applyArgsToSettings([], preset);

		expect(actual).toEqual({});
	});

	it("returns the same settings when args don't exclude Blocks and settings is provided", () => {
		const settings = {
			blocks: { add: [blockD], exclude: [] },
			options: {
				value: 123,
			},
		};
		const actual = applyArgsToSettings(["--other"], preset, settings);

		expect(actual).toBe(settings);
	});

	it("returns an error when an unknown Block is excluded", () => {
		const settings = {
			blocks: { add: [blockD], exclude: [] },
			options: {
				value: 123,
			},
		};
		const actual = applyArgsToSettings(["--exclude-other"], preset, settings);

		expect(actual).toEqual(
			new Error(
				"Block exclusion doesn't match any preset block: '--exclude-other'.",
			),
		);
	});

	it("returns settings with the Block excluded when one of the Preset's Blocks is excluded", () => {
		const settings = {
			blocks: { add: [blockD], exclude: [blockA] },
			options: {
				value: 123,
			},
		};
		const actual = applyArgsToSettings(["--exclude-b"], preset, settings);

		expect(actual).toEqual({
			blocks: {
				add: [blockD],
				exclude: [blockA, blockB],
			},
			options: {
				value: 123,
			},
		});
	});
});
