import { describe, expect, test } from "vitest";

import { BlockWithAddons } from "../types/blocks.js";
import { mergeAddons } from "./mergeAddons.js";

const blockFirst = {} as BlockWithAddons<object, object>;
const blockSecond = {} as BlockWithAddons<object, object>;

const sharedObject = { value: true };

describe("mergeAddons", () => {
	test.each([
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: ["a"], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: ["b"], block: blockFirst }],
			[{ addons: ["a", "b"], block: blockFirst }],
		],
		[
			[{ addons: ["a", "b"], block: blockFirst }],
			[{ addons: ["b"], block: blockFirst }],
			[{ addons: ["a", "b"], block: blockFirst }],
		],
		[
			[{ addons: ["a", "b"], block: blockFirst }],
			[{ addons: ["b", "c"], block: blockFirst }],
			[{ addons: ["a", "b", "c"], block: blockFirst }],
		],
		[
			[{ addons: ["a", "b"], block: blockFirst }],
			[{ addons: ["b", "c", "d"], block: blockFirst }],
			[{ addons: ["a", "b", "c", "d"], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: [null], block: blockFirst }],
			[{ addons: ["a"], block: blockFirst }],
		],
		[
			[{ addons: ["a", undefined, null, "b"], block: blockFirst }],
			[{ addons: [null], block: blockFirst }],
			[{ addons: ["a", "b"], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: ["a"], block: blockSecond }],
			[
				{ addons: ["a"], block: blockFirst },
				{ addons: ["a"], block: blockSecond },
			],
		],
		[
			[{ addons: [{ values: ["a"] }], block: blockFirst }],
			[{ addons: [{ values: ["a"] }], block: blockFirst }],
			[{ addons: [{ values: ["a"] }], block: blockFirst }],
		],
		[
			[{ addons: ["a"], block: blockFirst }],
			[{ addons: [123], block: blockFirst }],
			new Error(`Mismatched types in Block Addons: string and number.`),
		],
		[
			[{ addons: [{ value: true }], block: blockFirst }],
			[{ addons: [123], block: blockFirst }],
			new Error(`Mismatched types in Block Addons: object and number.`),
		],
		[
			[{ addons: [{ value: {} }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
		],
		[
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[{ addons: [{ value: {} }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
		],
		[
			[{ addons: [{ value: true }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			new Error(`Mismatched types in Block Addons: boolean and object.`),
		],
		[
			[{ addons: [{ value: [true] }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			new Error(`Mismatched types in Block Addons: array and non-array.`),
		],
		[
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			[{ addons: [{ value: [true] }], block: blockFirst }],
			new Error(`Mismatched types in Block Addons: non-array and array.`),
		],
		[
			[{ addons: [{ value: { inner: false } }], block: blockFirst }],
			[{ addons: [{ value: { inner: true } }], block: blockFirst }],
			new Error(`Mismatched values in Block Addons: false and true.`),
		],
		[
			[{ addons: [{ value: sharedObject }], block: blockFirst }],
			[{ addons: [{ value: sharedObject }], block: blockFirst }],
			[{ addons: [{ value: sharedObject }], block: blockFirst }],
		],
	])("%j and %j", (first, second, expected) => {
		const act = () => mergeAddons(first, second);

		if (expected instanceof Error) {
			expect(act).toThrow(expected);
		} else {
			expect(act()).toEqual(expected);
		}
	});
});
