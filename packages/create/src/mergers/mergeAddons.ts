import { BlockWithAddons } from "../types/blocks.js";
import { CreatedBlockAddons } from "../types/creations.js";

export function mergeAddons<Options extends object | unknown[]>(
	first: CreatedBlockAddons<object, Options>[],
	second: CreatedBlockAddons<object, Options>[],
): CreatedBlockAddons<object, Options>[] {
	const byBlock = new Map<BlockWithAddons<object, Options>, object>();

	for (const { addons, block } of [...first, ...second]) {
		byBlock.set(block, mergeBlockAddons(byBlock.get(block), addons) as object);
	}

	return Array.from(byBlock).map(([block, addons]) => ({ addons, block }));
}

function isNotNullish(value: unknown) {
	return value != null;
}

function mergeBlockAddonArrays(firsts: unknown[], seconds: unknown[]) {
	const firstNonNullish = firsts.filter(isNotNullish);
	const secondNonNullish = seconds.filter(isNotNullish);

	return mergeBlockAddonArraysNonNullish(firstNonNullish, secondNonNullish);
}

function mergeBlockAddonArraysNonNullish(
	firsts: unknown[],
	seconds: unknown[],
) {
	const results: unknown[] = [];

	for (let i = 0; i < firsts.length; i += 1) {
		const first = firsts[i];
		const second = seconds[i];

		if (typeof first === typeof second && typeof first !== "object") {
			results.push(first);

			if (first !== second) {
				results.push(second);
			}
		} else {
			results.push(mergeBlockAddonValues(first, second));
		}
	}

	for (let i = seconds.length; i < firsts.length; i += 1) {
		results.push(firsts[i]);
	}

	for (let i = firsts.length; i < seconds.length; i += 1) {
		results.push(seconds[i]);
	}

	return Array.from(new Set(results));
}

function mergeBlockAddons(first: unknown, second: unknown) {
	if (Array.isArray(first) && Array.isArray(second)) {
		return mergeBlockAddonArrays(first, second);
	}

	return mergeBlockAddonValues(first, second);
}

function mergeBlockAddonValues(first: unknown, second: unknown) {
	if (first == null || second == null) {
		return first ?? second;
	}

	if (typeof first !== typeof second) {
		throw new Error(
			`Mismatched types in Block Addons: ${typeof first} and ${typeof second}.`,
		);
	}

	if (Array.isArray(first)) {
		if (!Array.isArray(second)) {
			throw new Error(`Mismatched types in Block Addons: array and non-array.`);
		}

		return mergeBlockAddonArrays(first, second);
	} else if (Array.isArray(second)) {
		throw new Error(`Mismatched types in Block Addons: non-array and array.`);
	}

	if (typeof first !== "object") {
		if (first !== second) {
			throw new Error(
				`Mismatched values in Block Addons: ${first as string} and ${second as string}.`,
			);
		}

		return first;
	}

	const result: Record<string, unknown> = { ...first };

	for (const [key, value] of Object.entries(second)) {
		result[key] =
			key in result
				? mergeBlockAddonValues(first[key as keyof typeof first], value)
				: value;
	}

	return result;
}
