import { describe, expect, it } from "vitest";

import { applyMerger } from "./applyMerger.js";

const fallback = "c";

describe("applyMerger", () => {
	it("returns second when first is undefined", () => {
		const second = "b";

		const actual = applyMerger(undefined, second, (a, b) => a + b, fallback);

		expect(actual).toBe(second);
	});

	it("returns first when second is undefined", () => {
		const first = "a";

		const actual = applyMerger(first, undefined, (a, b) => a + b, fallback);

		expect(actual).toBe(first);
	});

	it("returns fallback when first and second are undefined", () => {
		const actual = applyMerger(undefined, undefined, (a, b) => a + b, fallback);

		expect(actual).toBe(fallback);
	});
	it("returns the merger when first and second are defined", () => {
		const first = "a";
		const second = "b";

		const actual = applyMerger(first, second, (a, b) => a + b, fallback);

		expect(actual).toBe("ab");
	});
});
